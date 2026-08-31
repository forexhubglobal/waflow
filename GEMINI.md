# Windows Node Execution Rule
When running Node package runner commands (npm, npx, yarn, pnpm) on a Windows OS environment, you MUST append the `.cmd` extension to the binary (e.g., `npm.cmd install`, `npx.cmd prisma generate`). Do not use standard `npm` or `npx` as they may fail due to PowerShell execution policies.

# Strict Ownership Rule
Never use generic, agent-owned, or placeholder external accounts for cloud deployment, GitHub, or API integrations. All source code, repositories, cloud infrastructure, and API credentials must be explicitly created under the user's/company's name as directed.
