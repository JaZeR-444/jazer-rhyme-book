#!/usr/bin/env python3
"""
Generate a complete folder schema (tree) from a root directory.

Design goals:
- Full depth by default (no max-depth cutoff)
- Avoid infinite recursion via symlinks by default
- Show all files and directories by default (use --dirs-only to limit)
- Robust against permission errors and transient OS errors
"""

from __future__ import annotations

import argparse
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, List, Optional, Set


DEFAULT_EXCLUDE_NAMES = {
    "node_modules",
    "__pycache__",
    ".git",
    ".gemini",
}

DEFAULT_EXCLUDE_GLOBS = {
    "*.pyc",
    "*.pyo",
    "*.tmp",
}


@dataclass(frozen=True)
class TreeConfig:
    exclude_names: Set[str]
    exclude_globs: Set[str]
    include_hidden: bool
    dirs_only: bool
    follow_symlinks: bool
    show_errors: bool
    max_items_per_dir: Optional[int]  # None = no truncation
    timeout_seconds: Optional[float]  # None = no timeout


def _is_hidden(path: Path) -> bool:
    return path.name.startswith(".")


def _excluded(path: Path, cfg: TreeConfig) -> bool:
    if path.name in cfg.exclude_names:
        return True

    if not cfg.include_hidden and _is_hidden(path):
        return True

    for pattern in cfg.exclude_globs:
        if path.match(pattern):
            return True

    return False


def _sort_items(items: Iterable[Path]) -> List[Path]:
    # Dirs first, then files; stable, case-insensitive.
    def key(p: Path):
        try:
            is_dir = p.is_dir()
        except OSError:
            is_dir = False
        return (0 if is_dir else 1, p.name.lower())

    return sorted(items, key=key)


def generate_tree_lines(
    root: Path,
    cfg: TreeConfig,
    *,
    prefix: str = "",
    start_time: float,
) -> List[str]:
    # Optional timeout (does not cut depth unless you opt in)
    if cfg.timeout_seconds is not None:
        if (time.time() - start_time) > cfg.timeout_seconds:
            return [f"{prefix}[Stopped: timeout exceeded]"]

    try:
        items = list(root.iterdir())
    except PermissionError:
        return [f"{prefix}[Access Denied]"]
    except OSError as e:
        return [f"{prefix}[Error: {e}]"] if cfg.show_errors else [f"{prefix}[Error]"]

    # Filter excludes and (optionally) files
    filtered: List[Path] = []
    for item in items:
        if _excluded(item, cfg):
            continue
        if cfg.dirs_only:
            try:
                if not item.is_dir():
                    continue
            except OSError:
                continue
        filtered.append(item)

    filtered = _sort_items(filtered)

    # Optional per-directory item limiter (does not hide the fact items exist)
    shown = filtered
    remainder = 0
    if cfg.max_items_per_dir is not None and len(filtered) > cfg.max_items_per_dir:
        shown = filtered[: cfg.max_items_per_dir]
        remainder = len(filtered) - cfg.max_items_per_dir

    lines: List[str] = []
    count = len(shown)

    for i, item in enumerate(shown):
        is_last = i == (count - 1) and remainder == 0
        connector = "└── " if is_last else "├── "

        display_name = item.name
        try:
            if item.is_symlink():
                display_name += " -> [symlink]"
        except OSError:
            pass

        lines.append(f"{prefix}{connector}{display_name}")

        # Recurse into directories
        try:
            is_dir = item.is_dir()
        except OSError:
            is_dir = False

        if is_dir:
            # Avoid following symlinked directories unless explicitly enabled
            if not cfg.follow_symlinks:
                try:
                    if item.is_symlink():
                        continue
                except OSError:
                    continue

            extension = "    " if (is_last) else "│   "
            lines.extend(
                generate_tree_lines(
                    item,
                    cfg,
                    prefix=prefix + extension,
                    start_time=start_time,
                )
            )

    if remainder > 0:
        # Indicate that additional items exist without pretending they were listed
        lines.append(f"{prefix}└── … ({remainder} more items not shown; increase --max-items-per-dir)")

    return lines


def build_arg_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(description="Generate a complete folder tree schema.")
    p.add_argument("path", nargs="?", default=".", help="Root path (default: current directory).")
    p.add_argument("--output", "-o", default="folder_structure.txt", help="Output file name/path.")
    p.add_argument("--dirs-only", action="store_true", help="Only show directories (hide files).")
    p.add_argument("--include-files", action="store_true", help="Include files (now default; flag kept for compatibility).")
    p.add_argument("--include-hidden", action="store_true", help="Include dotfiles/dotfolders.")
    p.add_argument("--follow-symlinks", action="store_true", help="Follow symlinked directories (risk loops).")
    p.add_argument("--show-errors", action="store_true", help="Show full OS error messages in output.")
    p.add_argument("--print", dest="print_stdout", action="store_true", help="Also print to stdout.")

    p.add_argument("--exclude", action="append", default=[], help="Exclude by exact name (repeatable).")
    p.add_argument("--exclude-glob", action="append", default=[], help="Exclude by glob pattern (repeatable).")

    # Optional “limits” that do NOT cap depth; they only affect output/safety if you opt in.
    p.add_argument(
        "--max-items-per-dir",
        type=int,
        default=None,
        help="If set, show only first N items per directory and add an ellipsis line.",
    )
    p.add_argument(
        "--timeout-seconds",
        type=float,
        default=None,
        help="If set, stop traversal after N seconds (prints a stop marker).",
    )

    return p


def main() -> int:
    args = build_arg_parser().parse_args()

    root = Path(args.path).expanduser().resolve()
    if not root.exists():
        raise SystemExit(f"Path does not exist: {root}")
    if not root.is_dir():
        raise SystemExit(f"Path is not a directory: {root}")

    # Default to showing files (dirs_only=False) unless user explicitly requests dirs-only
    dirs_only = False
    if args.dirs_only:
        dirs_only = True

    cfg = TreeConfig(
        exclude_names=DEFAULT_EXCLUDE_NAMES | set(args.exclude),
        exclude_globs=DEFAULT_EXCLUDE_GLOBS | set(args.exclude_glob),
        include_hidden=args.include_hidden,
        dirs_only=dirs_only,
        follow_symlinks=args.follow_symlinks,
        show_errors=args.show_errors,
        max_items_per_dir=args.max_items_per_dir,
        timeout_seconds=args.timeout_seconds,
    )

    start_time = time.time()
    root_name = f"{root.name}/"
    lines = [root_name] + generate_tree_lines(root, cfg, start_time=start_time)
    output_text = "\n".join(lines) + "\n"

    out_path = Path(args.output).expanduser()
    if out_path.exists() and out_path.is_dir():
        out_path = out_path / "folder_structure.txt"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(output_text, encoding="utf-8")

    if args.print_stdout:
        print(output_text, end="")

    print(f"Folder structure saved to: {out_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
