# Architecture Decision Records

This folder records the significant decisions about how Berlin Visualized is built, and why.

Each ADR is a short Markdown file named `NNNN-title.md`. It follows the format
from [Michael Nygard's original post](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions):
**Status, Context, Decision, Consequences**.

- ADRs are never deleted. If a decision changes, write a new ADR and mark the old one **Superseded by NNNN**.
- Status is one of: **Proposed**, **Accepted**, **Superseded**, **Deprecated**.
- To add one, copy [`template.md`](template.md) and take the next number.

## Index

| # | Title | Status | Date |
| --- | --- | --- | --- |
| [0001](0001-record-architecture-decisions.md) | Record architecture decisions | Accepted | 2026-11-15 |
| [0002](0002-config-driven-data-layers.md) | Config-driven data layers behind a caching backend | Accepted | 2026-11-15 |
| [0003](0003-berlin-data-sources.md) | Berlin data sources and rollout order | Accepted | 2026-11-15 |
| [0004](0004-overview-landing-page.md) | Overview landing page | Accepted | 2026-11-15 |
