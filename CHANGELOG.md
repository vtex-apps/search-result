# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Changed
- Update loading to use an overlay instead of content loader after initial mount.

### Changed
- Replace tachyons colors with design tokens.

### Added
- Not found page component.

## [2.4.0] - 2018-11-16
### Changed
- Added better support for use outside a search context.

## [2.3.4] - 2018-11-13
### Changed
- Set search filters not to scroll page when edited

## [2.3.3] - 2018-11-08
### Fixed
- Fix layout on IE and add polyfill for `String.prototype.normalize`.

## [2.3.2] - 2018-11-07
### Fixed
- Typo in the `locales pt-BR`.

## [2.3.1] - 2018-11-06
### Changed
- Only show custom query schema if not inside search context.

## [2.3.0] - 2018-11-06
### Added
- Add field `orderBy` to custom query schema.

## [2.2.0] - 2018-10-31
### Fixed
- Fix slug being modified for every type, instead of only brands.

## [2.1.0] - 2018-10-22
### Added
- Possibility of usage without search query context.

## [2.0.5] - 2018-10-18
### Fixed
- Fix bug when lateral menu was open.

## [2.0.4] - 2018-10-18
### Fixed
- Fix using name of the facet as the slug.

## [2.0.3] - 2018-10-15
### Fixed
- Fix props of breadcrumbs when it has an accented letter.

## [2.0.2] - 2018-10-09
### Fixed
- Change breakpoint of vertical divider in SearchResult in mobile view and add :term to the view + correction of encoded values passed to :term 

## [2.0.1] - 2018-10-02
### Changed
- Moved the filter navigator, gallery and product summary to extension points.

## [1.6.0] - 2018-10-02
### Added
- Different viewmode of the result on mobile.

## [1.5.2] - 2018-09-28
### Fixed
- Fix breadcrumb being shown on mobile.

### Removed
- Content loader of filters on mobile.

## [1.5.1] - 2018-09-20
### Fixed
- Fix breadcrumb padding to match the product details.

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
