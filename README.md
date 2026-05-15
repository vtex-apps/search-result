# search-result

VTEX IO Store Framework app (`vtex.search-result`) that exports the **PLP (Product Listing Page) blocks** for VTEX storefronts: galleries, filter navigators, sort controls, layout switchers, pagination, and "not found" states.

It is the storefront consumer of the GraphQL surface published by [`vtex.search-graphql`](https://github.com/vtex-apps/search-graphql) and implemented by [`vtex.search-resolver`](https://github.com/vtex-apps/search-resolver). It also coordinates with [`vtex.delivery-promise-components`](https://github.com/vtex/delivery-promise-components) for pickup-point shipping facets on PLP.

> See [`AGENTS.md`](AGENTS.md) for the full architectural walkthrough.

---

## Prerequisites

- [Node.js 12](https://nodejs.org/) (managed via `.nvmrc` — use `nvm use`). **Note: Node 12 is the legacy CI target while this app's dependency tree is migrated.** Use a project-local Node manager to avoid affecting other repos.
- [Yarn](https://yarnpkg.com/) (v1)
- [VTEX Toolbelt](https://github.com/vtex/toolbelt): `npm i -g vtex`
- An active VTEX account and development workspace: `vtex login <account>`

## How to run

Install dependencies and refresh VTEX IO typings:

```sh
make dev
```

Link the app to your development workspace:

```sh
make link
# or equivalently: make run
```

Linking publishes the React blocks to the active workspace. Confirm with `vtex whoami` before linking.

## How to test

Run the React unit test suite (via `vtex-test-tools`):

```sh
make test
```

Run all quality checks (lint + test) before opening a PR:

```sh
make check
```

Run with coverage report:

```sh
make coverage
```

## How to publish

> ⚠️ These commands affect production. Always confirm the target account/workspace first.

```sh
vtex publish        # publishes a new app package to the registry
vtex deploy         # promotes a release candidate to stable
```

Version bumps use `vtex release <patch|minor|major> stable`. The current default branch for releases is `master`.

## Documentation

- **Architecture and block contracts:** [`AGENTS.md`](AGENTS.md)
- **Domain glossary:** [`docs/glossary.md`](docs/glossary.md)
- **Data model:** [`docs/data-model.md`](docs/data-model.md)
- **SDD model guide:** [`docs/sdd/model-guide.md`](docs/sdd/model-guide.md)
- **Specs (multi-repo aggregator):** `is-io-specs/.specify/` — constitution, plans, tasks live in the parent
- **Block reference, props, content schemas:** [`docs/`](docs/), [`store/interfaces.json`](store/interfaces.json), [`store/contentSchemas.json`](store/contentSchemas.json)
- **Changelog:** [`CHANGELOG.md`](CHANGELOG.md)
