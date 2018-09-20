# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.5.0] - 2018-09-20
### Fixed
- Removed `ProductSearchContextProvider` state change to avoid unnecessary dependency.

## [1.4.0] - 2018-09-18
### Added
- ShowMore loading option

## [1.3.1] - 2018-09-14
### Fixed
- Fix incorrect specification filter being removed with more than 1 in map.

## [1.3.0] - 2018-09-13
### Added
- Add the possibility to hide the search-result facets

## [1.2.0] - 2018-09-13
### Changed
- Migrate to use range slider from `vtex.styleguide`.

## [1.1.2] - 2018-09-13
### Changed
- Update the `vtex.product-summary` version.

### Fixed
- Filter content loader height and width.

## [1.1.1] - 2018-09-06
### Added
- Content loader on filter facets app.

## [1.1.0] - 2018-09-06
### Added
- `RangeSlider` component.

### Changed
- Updated price range facet to use range component.
- Use `priceRange` query to track the price filter.

## [1.0.1] - 2018-08-28
### Changed
- Upgraded `vtex.styleguide` to version 6.x.

### Fixed
- Checkbox position in chrome.

## [1.0.0] - 2018-08-24
### Changed
- Add mobile design and refactor components.

## [0.6.5] - 2018-08-22
### Changed
- Update specification filter to get slug from link.

### Fixed
- Error on normalize function of the product summary.

## [0.6.4] - 2018-08-08
### Added
- PriceRange filter.

### Changed
- Refactor components.

## [0.6.3] - 2018-08-02
### Changed
- Bump `vtex.styleguide` major version.

## [0.6.2] - 2018-07-31
### Changed
- Refactor filter and update API usage.

## [0.6.1] - 2018-07-24
### Fixed
- Error when trying to access empty array.

## [0.6.0] - 2018-07-24
### Removed
- `facetsQuery` reference.

### Added
- multiselect for search filter.

## [0.5.2] - 2018-07-19
### Fixed
- Remove code dependency with the resolved page path (e.g. `/eletronics/d`).

## [0.5.1] - 2018-07-19
### Fixed
- Remove code dependency with the global runtime.

## [0.5.0] - 2018-7-6
### Added
- Add `SearchFooter` and `SearchResultInfiniteScroll` tests.

### Changed
- Link redirect working based on the `pagesPath` prop.
- Remove GraphQL queries that will be at the [vtex-apps/store](https://github.com/vtex-apps/store/pull/18) project.

### Fixed
- Fix `setContextVariables` function call.
- Fix SearchResult loading state to not trigger the `fetchMore` function in the first query.

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
