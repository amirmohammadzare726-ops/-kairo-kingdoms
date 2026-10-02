# Kairo Kingdoms — Floot source migration

This branch preserves the original application source copied from the live Floot project on 2026-10-02.

## Imported source
- `floot-original/pages/_index.tsx`
- `floot-original/pages/_index.module.css`
- `floot-original/components/StrategyMap.tsx`
- `floot-original/components/StrategyMap.module.css`
- `floot-original/base.css`

These files are an archival source import, not yet wired into the Vite prototype. The existing `main` branch and its prototype have not been modified.

## Important migration gaps
- Floot-hosted image assets are still referenced by their original CDN URLs; binary asset files have not yet been copied into this repository.
- The Floot runtime provides React, routing, authentication helpers, endpoints and hosted services. Those dependencies and services must be audited and ported before this source can run as a standalone Vite app.
- Database schema/data, authentication/session behavior, realtime services, secrets and scheduled jobs have not yet been migrated.
- Do not treat this branch as a complete or deployable replacement for the live Floot app.

## Source of truth during migration
Live application: https://kairo-kingdoms.floot.app  
Source project ID: `f76a02e1-ef9e-46df-b0b9-8e449c1a3bcf`

The live Floot app remains published and unchanged. Continue migration incrementally on this branch, validating each stage before any production switch.
