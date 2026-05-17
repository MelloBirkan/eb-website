<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project conventions

- Use Bun for this project. Prefer `bun run ...`, `bunx ...`, and `bun install` over npm, npx, pnpm, or yarn commands.
- When documentation is needed, use the `ref mcp` to look up the relevant docs before making implementation decisions.
- Before creating UI components, inspect the `components` folder to see whether an existing component already fits the need.
- Prefer reusing components from `components` over creating new ones.
- Create new components only when there is no ready-made component that already does what is needed.

## Cursor Cloud specific instructions

- **Dev server**: `bun run dev` starts Next.js 16.2.4 with Turbopack on port 3000.
- **Lint**: `bun run lint` runs ESLint. Pre-existing warnings/errors exist in `pages/` template files (unescaped entities, `<img>` usage); these are not blocking.
- **Build**: `bun run build` runs the production build.
- **No database or auth**: The site is static/SSR with one optional Anthropic API integration for the Agent Chat feature. The `ANTHROPIC_API_KEY` env var is only needed for the `/tutorial/plugins/ios` agent chat; the rest of the site works without it.
- **Bun path**: Bun is installed at `~/.bun/bin/bun`. The update script exports `BUN_INSTALL` and `PATH` before running commands. If bun is not on PATH, run `export BUN_INSTALL="$HOME/.bun" && export PATH="$BUN_INSTALL/bin:$PATH"`.
- **No tests**: There are no automated test suites in this project. Manual browser testing is the primary verification method.
