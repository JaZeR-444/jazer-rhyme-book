import { useMemo } from "react";
import "./DraggableCard.css";

/**
 * Minimal DraggableCard stub.
 * - Wraps children
 * - Adds data attributes you can hook into later
 * - Does NOT require any DnD library to compile
 */
export function DraggableCard({
  id,
  type = "card",
  disabled = false,
  className = "",
  children,
  ...props
}) {
  const attrs = useMemo(() => {
    return {
      "data-draggable": disabled ? "false" : "true",
      "data-dnd-type": type,
      "data-dnd-id": id ?? "",
    };
  }, [disabled, type, id]);

  return (
    <div
      {...attrs}
      className={`draggable-card ${disabled ? "is-disabled" : ""} ${className}`}
      draggable={!disabled}
      {...props}
    >
      {children}
    </div>
  );
}
