<!-- managed-by: golden-path v1 — generated from .agents/skills/golden-path/sdd-mode.md.
     Model references can drift as new Claude versions ship.
     Re-run `/golden-path apply` to refresh. -->
# SDD Model Guide

Reference model tiers for Spec-Driven Development (SDD) commands.

## Models per command

| Command | Tier | Reference model |
|---|---|---|
| `/speckit.constitution` | Tier 1 reasoning | Claude 4.7 Opus or higher |
| `/speckit.specify` | Tier 1 reasoning | Claude 4.7 Opus or higher |
| `/speckit.plan` | Tier 1 reasoning | Claude 4.7 Opus or higher |
| `/specification` | Tier 1 reasoning | Claude 4.7 Opus or higher |
| `/implementing` | Tier 1 reasoning | Claude 4.7 Opus or higher |
| `/speckit.clarify` | Standard execution | Claude 4.6 Sonnet or higher |
| `/speckit.tasks` | Standard execution | Claude 4.6 Sonnet or higher |
| `/speckit.analyze` | Standard execution | Claude 4.6 Sonnet or higher |
| `/speckit.implement` | Standard execution | Claude 4.6 Sonnet or higher |

## SDD approach for this repo

**Both modes apply per-task.**

- **SDD Lite** for: block prop additions, content schema tweaks, CSS handle additions, minor UI fixes, i18n updates. Use `/specification` + `/implementing` from `vtex-agent-skills`.
- **SDD Full** for: new top-level blocks, breaking interface changes in `store/interfaces.json`, GraphQL query restructures (which ripple to `search-resolver`/`search-graphql`), major refactors of the FilterNavigator family. Use the spec-kit pipeline.

## Multi-repo storage

This is one repo in the `is-io-specs` multi-repo workspace. SpecKit artifacts live at `is-io-specs/.specify/` and `is-io-specs/specs/`. See the [Multi-repo spec-kit extension](https://github.com/vtex/speckit-multi-repo).
