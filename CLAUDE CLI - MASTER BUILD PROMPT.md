CLAUDE CLI — MASTER BUILD PROMPT
Project: JaZeR Master Flow Knowledge Hub (Multipage Website)

ROLE
You are a senior front-end engineer + UI systems designer. Build a premium, multipage website that documents and showcases the “JaZeR Master Flow Knowledge Hub” project described below. Prioritize clarity, speed, and a polished cyberpunk/neon professional aesthetic.

PRIMARY GOAL
Create a production-ready, multi-page React + Vite site (inside /web) that:
1) Presents the project clearly within 5 seconds (what it is, why it exists, how it’s structured).
2) Provides an intuitive explorer for Domains + Entities (from /data).
3) Provides a Dictionary browser for the Rap_Dictionary_Master_Hub (markdown word pages).
4) Includes Search across domains/entities + dictionary (client-side indexes).
5) Uses tasteful, high-end motion (GSAP) without harming performance.
6) Builds and runs locally with minimal setup.

CONSTRAINTS & ASSUMPTIONS
- Repository already contains:
  - /data/** (domains, entities, indexes, relations)
  - /Rap_Dictionary_Master_Hub/** (A-Z markdown dictionary)
  - /web/** (existing React + Vite scaffolding may exist)
  - /scripts/**, /schemas/**, /_meta/**
- Prefer client-side rendering. No server required.
- Do not require external services.
- Keep dependencies minimal and well-justified.
- Must run on Node >= 14 (if any dependency requires higher, call it out and choose an alternative).
- If you must change Node requirement, do it only if unavoidable and explain why.

DELIVERABLES
1) A complete multipage site using React Router with routes:
   - / (Home / Overview)
   - /domains (Domain Universe)
   - /domains/:domainId (Domain Detail)
   - /entities/:domainId/:entityId (Entity Detail)
   - /dictionary (Dictionary Home)
   - /dictionary/:letter (Letter Index)
   - /dictionary/:letter/:word (Word Page rendered from markdown)
   - /search (Global Search)
   - /architecture (Architecture / Data Flow)
   - /docs (How to contribute / schemas / validation commands)
   - /about (License / attribution)
   - /404

2) A consistent design system:
   - CSS variables / theme tokens (neon purple/teal/pink on dark)
   - Typography scale, spacing scale, radius, shadows/glows
   - Reusable components: AppShell, TopNav, SideNav, Footer, Card, Badge, TagPill, StatGrid, Breadcrumbs, SearchBar, Tabs, Table, CodeBlock, MarkdownRenderer, EntityCard, RelationGraph (simple), DomainGrid, EmptyState, LoadingState.

3) Data loading utilities:
   - Load domain list from /data directory structure (assume /data has folders per domain).
   - Load entity JSON for a domain from `/data/<domain>/entities/*.json`.
   - Load indexes when available:
     - `/data/<domain>/indexes/by_tag.json`
     - `/data/<domain>/indexes/alias_map.json`
     - `/data/_indexes/all_entities.json`
     - `/data/_relations/global_relations.json`
   - Implement robust error handling if files are missing.
   - Do not attempt to fetch from filesystem directly at runtime. Use Vite-friendly static assets strategy.

4) Build strategy for data/assets:
   - Implement a small Node build step (inside /web or root) that copies:
     - `/data` into `/web/public/data`
     - `/Rap_Dictionary_Master_Hub` into `/web/public/dictionary`
   - Ensure this runs via npm scripts:
     - `npm run web:prepare` (copies assets)
     - `npm run dev` (from /web) works after prepare
   - If /web already has scripts, integrate cleanly.

5) Dictionary markdown rendering:
   - Render markdown nicely (headings, tables, code blocks).
   - Include a “Copy” button on code blocks.
   - Provide previous/next word navigation within a letter if possible.

6) Search:
   - Global search that supports:
     - entity name, id, aliases, tags, description
     - dictionary words by title + content snippet (optional—at least word name)
   - Provide filters:
     - Type: Entities vs Dictionary
     - Domain filter
     - Tag filter (entities)
   - Performance: prebuild a small search index JSON at build time (not heavy). If you use a library, justify it; otherwise implement a simple index.

7) Relations visualization:
   - Lightweight: show related_ids list and a small “relationship map” view:
     - at minimum a list grouped by relation_type
     - optional: simple node-link view using SVG/canvas (no huge libs)
   - Must degrade gracefully if relations files are absent.

8) Motion / polish:
   - Use GSAP for:
     - page transitions (subtle)
     - hero intro (fast, minimal)
     - hover micro-interactions (optional)
   - Ensure “reduced motion” support.

9) Documentation page:
   - Show how to add entities, validate, build indexes, and where to edit.
   - Emphasize: never edit generated indexes directly.

OUTPUT FORMAT REQUIREMENTS (IMPORTANT)
- You must output:
  A) A proposed final folder structure under /web (tree).
  B) A list of dependencies to add (with reasons).
  C) Full code for all new/modified files, each preceded by a clear file path header.
  D) Any commands to run (exact).
- Do not omit files necessary to run.
- If the repository already contains /web, adapt rather than reinvent; still provide full file contents for changed files.

DESIGN BRIEF (AESTHETIC)
- High-end “JaZeR” vibe: neon purple primary, teal accents, pink highlights, dark background.
- Premium, not gaudy: glows are subtle, gradients controlled.
- Cards with glassy surfaces; soft shadows; crisp typography.
- Responsive from mobile to desktop.
- Icons: use a lightweight icon set if needed.

CONTENT TO REPRESENT (FROM README)
- Positioning: “The Ultimate AI-Powered Creative Arsenal for Lyricists, Writers, and Knowledge Seekers”
- Key pillars:
  - 25+ Domains
  - A–Z Dictionary (Rap_Dictionary_Master_Hub)
  - AI-Optimized JSON structure
  - Automated validation with JSON Schema
  - Interconnected relations layer
  - Multi-interface: Python tools, Node scripts, React UI
- Architecture diagram sections:
  - Domains → Entities → Indexes → Relations
  - Data flow: Add Entity → Validate → Build Indexes → Generate Relations → Serve to AI/Web
- Domains list (as shown in README) and their categories.

QUALITY BAR
- Treat this like a real product. Clean code, clear naming, accessible UI.
- Provide sensible defaults and graceful fallbacks.
- Avoid bloated dependencies.
- The app should build and run without manual copying steps beyond the single prepare script.

START NOW
Begin by:
1) Analyzing the existing /web structure (assume you can read it).
2) Proposing folder tree changes.
3) Implementing the build/prepare step.
4) Building routes and core pages.
5) Implementing data loaders + search + markdown rendering.
6) Final pass for styling + motion + responsiveness.

END