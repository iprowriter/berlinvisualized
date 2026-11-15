# 0001. Record architecture decisions

- **Status:** Accepted
- **Date:** 2026-11-15

## Context

Berlin Visualized is growing from a single search map into a dashboard with many datasets.
Work happens across separate sessions, so the reasons behind structural choices
(how layers are added, where data comes from, what the landing page is for) get lost
unless they are written down next to the code.

## Decision

Record architecturally significant decisions as ADRs in `docs/adr/`, using the
Status / Context / Decision / Consequences format described in [the README](README.md).

## Consequences

- New sessions and contributors can read *why* the code is shaped the way it is before changing it.
- Changing a recorded decision means writing a new ADR that supersedes the old one, which takes a few minutes but keeps the history honest.
