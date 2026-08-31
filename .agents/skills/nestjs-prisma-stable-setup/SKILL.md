---
name: nestjs-prisma-stable-setup
description: >-
  Use this skill when setting up or troubleshooting a NestJS project with Prisma, especially when facing compilation issues with nest start --watch, ERR_MODULE_NOT_FOUND, or unstable Prisma versions.
---

# NestJS + Prisma Stable Setup

When configuring a NestJS backend with Prisma, follow these steps to avoid watch-mode compilation crashes and dependency errors:

## 1. Prisma Version Constraints
Always install Prisma v6 explicitly. Do not run `npm install prisma` without a version tag, as it may pull a release candidate (e.g., v8 RC) that breaks standard commands.
```bash
npm.cmd install prisma@6 @prisma/client@6
```

## 2. Package.json Module Type
Ensure that `"type": "module"` is **removed** from the `package.json` file if it was generated. Standard NestJS compilation expects CommonJS behavior. Leaving it as `module` will result in `ERR_MODULE_NOT_FOUND` runtime errors because Node will expect `.js` extensions on all internal imports.

## 3. TypeScript Configuration Fixes
Modify `tsconfig.json` to ensure the module resolution matches standard CommonJS and silences breaking deprecation warnings that stop `nest start --watch`:

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "moduleResolution": "node",
    "ignoreDeprecations": "6.0"
  }
}
```
*Note: Make sure to remove `"resolvePackageJsonExports": true` if it is present, as it conflicts with `moduleResolution: node`.*

## 4. Local Database Fallback (Windows)
If setting up a local database via `docker-compose` fails (e.g., Docker is not installed on the Windows machine), default to `sqlite` as the Prisma provider for rapid prototyping to unblock development:
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```
