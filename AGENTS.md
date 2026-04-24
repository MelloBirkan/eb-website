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
