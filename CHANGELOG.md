# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Add `SearchFooter` and `SearchResultInfiniteScroll` tests.

### Changed
- Link redirect working based on the `pagesPath` prop
- Remove GraphQL queries that will be at the `vtex-apps/store` project.

## [0.4.0] - 2018-6-20
### Added
- Add the Infinite Scroll feature to the page.
- Add a spinner to be shown when fetching more products.

### Fixed
- Fix `SearchFilter` title internationalization.

## [0.3.0] - 2018-6-14
### Added
- Internationalization to the schema.
- `SearchResult` component
- `SearchFilter` compoenent
- `SelectedFilters` component
- Graphql queries of `search` and `facets`
- Navigation buttons to paginated search.
- Implement SSR

### Changed
- Update `Checkbox` dependency to `vtex.styleguide` app.

## [0.2.0] - 2018-05-11
### Added
- Refactor app to import as default the product-summary app. 
- **Orderable gallery** Displays a list of products that can be ordered.
- **Update to the new Pages** Update to new version of Pages.