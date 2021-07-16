# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed
- Remove the code introduced by version `3.105.0`.

## [3.105.0] - 2021-07-15 [YANKED]
### Added
- `showClearAllFiltersOnDesktop` prop to the `FilterNavigator`.

## [3.104.0] - 2021-07-08

### Changed
- Pass `initialMap` to facets query.

## [3.103.0] - 2021-07-01
### Added
- Schemas for customizing Fetch More and Fetch Previous buttons behaviors through site-editor

## [3.102.0] - 2021-06-29

## [3.101.0] - 2021-06-24
## Fixed
- `scrollToTop` prop not being passed down to `PriceRange` component

## [3.100.0] - 2021-06-10
### Fixed
- Gallery item's position now starts at 1

### Added
- List name to GTM `productClick` event
- Passing `listName` and `position` prop to Product Summary

## [3.99.1] - 2021-06-08
### Fixed
- `FetchPrevious` and `FetchMore` links now consider the page number to improve SEO

## [3.99.0] - 2021-05-24
### Added
- `phone` option to the `layout` prop  from `FilterNavigator` component.

### Added
- Pixel event triggered when a filter is changed

## [3.98.4] - 2021-05-18
### Fixed
- Issue where paginated results would not render properly when lazy rendering is enabled.

## [3.98.3] - 2021-04-15
### Fixed
- Add new category mapping compatibility to `SearchTitle`

## [3.98.2] - 2021-04-06
### Added
- Main tests to the `FilterNavigator`.

## [3.98.1] - 2021-03-26

### Fixed
- Redirect URLs that follows the format `https://www.example.com`.

## [3.98.0] - 2021-03-25

### Added
- `categoryTreeBehavior` prop to the `SearchQuery`.

## [3.97.0] - 2021-03-09
### Added
- `"priceRangeLayout"` prop to the `FilterNavigator`.

## [3.96.0] - 2021-02-24
### Added
- `productCount` class on FacetItem

## [3.95.1] - 2021-02-23
### Fixed
- Search title with `/`.

## [3.95.0] - 2021-02-11
### Added
- `updateOnFilterSelectionOnMobile` prop to the `FilterNavigator`.
- `showClearByFilter` prop to the `FilterNavigator`.

## [3.94.0] - 2021-02-11

### Removed
- Query strings `fuzzy` and `operator` for searches that are not full text.

## [3.93.1] - 2021-02-09

### Fixed
- Reactivate search cache.

## [3.93.0] - 2021-01-28

### Changed
- Use `searchState` of the `sessionStorage` when it exists.

## [3.92.2] - 2021-01-28

### Fixed
- Temporarily removes the `searchResult` query cache.


## [3.92.1] - 2021-01-15
### Fixed
- Updated the app documentation (readme.md file) with links to the new recipe on building a search results page with multiple layouts.

## [3.92.0] - 2021-01-13
### Added
- New props: `customSummaryInterval` and `CustomSummary` to `gallery` block.

### Changed
- Migrate legacy Gallery components to TypeScript.
- Update usage of react-intl.

## [3.91.0] - 2021-01-11

### Added
- `position` prop to `GalleryItem`.
- send `position` prop in the `productClick` event.

## [3.90.0] - 2021-01-11

### Added
- Pass the `map` prop to the `productClick` event.

## [3.89.0] - 2021-01-11
### Added
- Query param identifying chosen gallery layout
- `css-handles` modifiers for chosen gallery layout

## [3.88.3] - 2021-01-08

### Fixed
- Badge z-index with priority over the orderBy filter.

## [3.88.2] - 2021-01-04

### Fixed
- Selecting a new filter doesn't reset the page count.

## [3.88.1] - 2020-12-09

### Fixed
- Remove `maxHeight` from the selected facets section.

## [3.88.0] - 2020-12-07
### Added
- `gallery` block: added support for multiple gallery layouts
- `gallery-layout-switcher`: new block that arranges options that allow users to switch between available gallery layouts with accessibility features
- `gallery-layout-option`: new block to be used with `gallery-layout-switcher` block to represent a layout option

## [3.87.3] - 2020-12-07

### Fixed
- Update the app documentation (README.md file)

## [3.87.2] - 2020-12-04

### Fixed
- `shouldDisable` when category tree is selected.

## [3.87.1] - 2020-12-03

### Fixed
- Fix broken and wrong links in the docs.

## [3.87.0] - 2020-12-03
### Added
- `categoryFiltersMode` prop to Filter Navigator Flexible.

## [3.86.4] - 2020-12-02
### Fixed
- `fetchMore` would not work correctly in some cases due to the `updateQuery` method being called with `prevResults` argument set to `undefined`. 

## [3.86.3] - 2020-12-02

### Fixed
- Missing `selectedFacets` in `shouldDisableFunction`

## [3.86.2] - 2020-12-02

### Fixed
- When all facets are unselected, the user is redirected to the home page.

### Changed
- Use `initialQuery` and `initialMap` instead of `window.initialSearchFacets`

## [3.86.1] - 2020-12-01

### Added
- `@vtex-apps/search-engagement-team` as CODEOWNER.

## [3.86.0] - 2020-11-17

### Changed
- `enableFiltersFetchOptimization` now working on mobile.

## [3.85.4] - 2020-11-13

### Fixed
- Deal with repeated filter options.

## [3.85.3] - 2020-11-13

### Fixed
- Initial search when `queryArgs` is `undefined`.

## [3.85.2] - 2020-11-13
### Changed
- Default `orderBy` value is now to order items by "Relevance", which now means products will follow the same ordering logic defined by the Search API.

## [3.85.1] - 2020-11-12
### Fixed
- Clear filters on mobile.

## [3.85.0] - 2020-11-12
### Added
- Prop `fullWidthOnMobile` to the `filter-navigator.v3`.
- Prop `navigationTypeOnMobile` to the `filter-navigator.v3`.

### Fixed
- Scroll on mobile not working properly.

## [3.84.4] - 2020-11-12

### Fixed
- `PriceRange` trauncating max value.

## [3.84.3] - 2020-11-11

### Fixed
- Remove the code introduced by version 3.84.1

## [3.84.2] - 2020-11-11
### Fixed
- Make new realease without the code introduced by version v3.83.0

## [3.84.1] - 2020-11-11 [YANKED]
### Fixed
- Clear filters on mobile.

## [3.84.0] - 2020-11-11
### Added
- Total products count on filter sidebar.

### Fixed
- `showFacetQuantity` on mobile.

## [3.83.0] - 2020-11-10 [YANKED]
### Added
- `gallery` block: added support for multiple gallery layouts
- `gallery-layout-switcher`: new block that arranges options that allow users to switch between available gallery layouts
- `gallery-layout-option`: new block to be used with `gallery-layout-switcher` block to represent a layout option

## [3.82.0] - 2020-11-10
### Added
- `"showAppliedFiltersOverview"` prop to the `SearchResult`.

## [3.81.2] - 2020-11-05
### Fixed
- Search title with percentage.

## [3.81.1] - 2020-11-05
### Changed
- Default `orderBy` value to an empty string.

## [3.81.0] - 2020-11-05
### Added
- New modifiers on CSS handles of mobile filters.

## [3.80.0] - 2020-11-05
### Added
- Prop `closeOnOutsideClick` on `filter-navigator.v3` to close filter on outside click.

## [3.79.1] - 2020-10-20
### Fixed
- Added `key` to `filter-less-items` & `filter-more-items` preventing button focus to fix unwanted auto-scroll behavior on chromium-based browsers.

## [3.79.0] - 2020-10-14
### Added
- `"showOrderTitle"` prop to OrderBy
- `"filterIsOpen"` CSS handle to Filter Navigator

## [3.78.1] - 2020-10-14
### Fixed
- `enableFiltersFetchOptimization` also affecting the mobile environment, always showing the maximum of 10 facets on mobile.
- Filter Navigator not showing when `enableFiltersFetchOptimization` wasn't enable.

## [3.78.0] - 2020-10-13
### Added
- Support for the `enableFiltersFetchOptimization` store setting, which makes it possible to fetch only the facets that were not truncated.

## [3.77.0] - 2020-10-05
### Added
- Translations.

## [3.76.0] - 2020-09-18
### Added
- Limits initial search items if option `enableLazySearchQuery` is enabled.

## [3.75.0] - 2020-09-18
### Added
- `includedPaymentSystems` and `excludedPaymentSystems` props to `SearchQuery`.

## [3.74.1] - 2020-09-16
### Fixed
- Regression in immediate facet selection

## [3.74.0] - 2020-09-14
### Added
- `openFiltersMode` on `filter-navigator.v3`

## [3.73.2] - 2020-09-12
### Fixed
- Allows truncating filters when lazy rendering is enabled

## [3.73.1] - 2020-09-11
### Changed
- Increase offset on GalleryRow view detection.

## [3.73.0] - 2020-09-10

### Added
- Prop `truncateFilters` that truncates filters with more than 10 options and displays a button to see all.

## [3.72.0] - 2020-09-09
### Added
- Default seller search to make filters work as well

## [3.71.3] - 2020-09-09
### Fixed
- Feedback on facet selection from the selected facets

## [3.71.2] - 2020-09-08
### Fixed
- Issue where lazy rendered filter groups wouldn't render its items properly

## [3.71.1] - 2020-09-08
### Fixed
- Always render the container of lazy rendered filter groups; this fixes some issues regarding ordering and CSS customization of filters.

## [3.71.0] - 2020-09-07
### Changed
- Immediate feedback on facet selection

### Added
- Lazy gallery rows rendering
- Lazy facet rendering, both individual facets and facet groups

## [3.70.0] - 2020-09-03

### Added
- Prop `thresholdForFacetSearch` that displays a Search bar to filter facets.

## [3.69.3] - 2020-09-03
### Fixed
- Prevent `SearchResultFlexible` from overflowing on mobile devices by setting its width.

## [3.69.2] - 2020-08-20
### Fixed
- Fix `hiddenFilters` prop documentation (`README.md` file)

## [3.69.1] - 2020-08-18

### Fixed
- Replace `map` by `mapField` in the `LocalQuery` component.

## [3.69.0] - 2020-08-14
### Added
- Prop `scrollToTop` to `filter-navigator.v3` that scrolls the page to the top when selecting a facet.

## [3.68.1] - 2020-08-13
### Fixed
- Added `mapField` and `queryField` props to the `README.md` file

## [3.68.0] - 2020-08-06
### Added
- Added Prop `htmlElementForButton` to change the html element rendered for `FetchMoreButton` or `FetchPreviousButton`.

## [3.67.1] - 2020-08-05
### Fixed
- Added `key` on `show-more` buttons to prevent focus after pressing them, which was causing the page to be fixed on the button after rendering more results on Google Chrome.

## [3.67.0] - 2020-08-04
### Added
- new prop `filtersTitleHtmlTag` for filterNavigatorV3 to change filters title html tag

## [3.66.2] - 2020-08-04
### Fixed
- HTML elements being rendered with ids equal to reserved global variable names, such as 'global', which would result in these variables being overwritten.

## [3.66.1] - 2020-07-31

### Fixed
- Missing filter options when there are no options selected.

## [3.66.0] - 2020-07-15
### Added
- New CSS handles for `galleryItem` with `displayMode`.

## [3.65.1] - 2020-07-13

### Fixed
- Temporarily remove `fuzzy`, `operator` and `searchState` from `handleFetchMoreNext` and `handleFetchMorePrevious`. They are causing a bug where the pagination is being reset.

## [3.65.0] - 2020-07-13
### Added
- New CSS handles on `order-by` selected item.

## [3.64.0] - 2020-07-09
### Added
- New CSS handles on filter navigator mobile.

## [3.63.3] - 2020-07-09

### Added
- `SearchResult` now adds `fuzzy`, `operator` and `searchState` to the URL.

### Fixed
- Deal with the `productClusterIds` differences caused by `search-resolver0.x` and `search-resolver1.x`.
- `Pricerange` event was not adding `fuzzy`, `operator` and `searchState` to the URL.
- `fuzzy`, `operator` and `searchState` were being reset in any search interaction.

## [3.63.2] - 2020-07-08

### Fixed
- `SearchTitle` crashing when `breadcrumb` prop is `null`.

### Security
- Bump dependencies versions.

## [3.63.1] - 2020-07-01

### Fixed
- `SearchResult` use the `facets` breadcrumb as fallback.

## [3.63.0] - 2020-06-29
### Added
- Be able to use `search-products-progress-bar` in `search-result`

## [3.62.2] - 2020-06-23
### Fixed
- Navigation on collections page.

## [3.62.1] - 2020-06-22
### Fixed
- Fixed "Clear" button on FT searches.

## [3.62.0] - 2020-06-22 [YANKED]
### Changed
- "Clear" button on mobile filters to uncheck every brand and specification filter.

## [3.61.0] - 2020-06-19

### Added
- Search redirect.

## [3.60.6] - 2020-06-16

### Fixed
- Problem with `useFetchMore` that displayed repeated products.

## [3.60.5] - 2020-06-15
### Added
- Accept `facets` breadcrumb as fallback.

## [3.60.4] - 2020-06-15
### Fixed
- Crashes happening when clicking on a department filter on mobile.

## [3.60.3] - 2020-06-12

### Added
- `__unstableProductOriginVtex` prop to the `SearchResultLayoutCustomQuery`.

## [3.60.2] - 2020-06-09
### Fixed
- Fixed CSS Handles table in README.md file (added the `--` between Handle and its modifier).


## [3.60.1] - 2020-06-09
### Fixed
- Updated README.md file with missing Handles.

## [3.60.0] - 2020-06-05
### Added
- New CSS handles: `filterBreadcrumbsItem` and `filterBreadcrumbsItemName`.

## [3.59.5] - 2020-06-03
### Fixed
- Decode map before split it in `selectedFacets`.

## [3.59.4] - 2020-06-02
### Added
- Hide facets with property `hidden`.

## [3.59.3] - 2020-06-01
### Added
- `query` to productClick event

## [3.59.2] - 2020-05-29
### Fixed
- Problem of components not rendering when child of flex-layout.

## [3.59.1] - 2020-05-29

### Changed
- Allows specification filters of type `number`.

## [3.59.0] - 2020-05-18
### Added
- Add specific classes to `filterGroup` and `filterItem` of the `filterAccordion` (filter mobile)

## [3.58.3] - 2020-05-14
### Fixed
- `handleClearFilters` function, improving the user experience when they click on the 'clean' button.

## [3.58.2] - 2020-05-13
### Fixed
- `TotalProducts` and `OrderBy` would not render expected text due to the default message id defined in `contentSchemas.json` being modified.

## [3.58.1] - 2020-05-12 [YANKED]
### Fixed
- Bug causing `TotalProducts` and `OrderBy` not to appear on non flexible components.

## [3.58.0] - 2020-05-12 [YANKED]
### Added
- Support for customization of `TotalProductsFlexible` and `OrderByFlexible` components via site-editor.

## [3.57.1] - 2020-05-06
### Fixed
- Cover cases where the category tree is empty in the `FilterNavigator`.

## [3.57.0] - 2020-05-04
### Added
- New CSS handles: `filtersWrapper` and `filtersWrapperMobile`.

## [3.56.2] - 2020-04-30
### Fixed
- Add prop `initiallyCollapsed` to docs.

## [3.56.1] - 2020-04-24
### Fixed
- Make query in component and done on SSR match.

## [3.56.0] - 2020-04-23
### Added
- New prop `maxItemsDepartment` to `filter-navigator.v3`.
- New prop `maxItemsCategory` to `filter-navigator.v3`.

## [3.55.3] - 2020-04-15

### Fixed

- Use empty array instead of undefined in specificationFilters.

## [3.55.2] - 2020-04-15

### Fixed
- Guarantee that the `refetchVariables` will follow the `search-protocol`.
- Send an empty filter when the `facets` query is not ready.
- Funcion `buildSelectedFacetsAndFullText` now cases where map is lesser than query.

## [3.55.1] - 2020-04-09

### Fixed
- The order in which the facets are sent to the `normalizeQueryMap` in the `vtex.store` app.
- Change from `productOrigin` to `productOriginVtex`

## [3.55.0] - 2020-04-08
### Added
- A compatibility layer to handle the new search protocol.
- `fuzzy`, `operator` and `searchState` props.

### Changed
- `FilterNavigator` children are not remounted each time a new facet is selected.
- When the user selects a new `priceRange`, the `facets` query will be reloaded.
- `FilterNavigator` now uses the `selected` property.

## [3.54.0] - 2020-04-07
### Added
- New block `search-products-progress-bar`.

## [3.53.2] - 2020-04-03
### Fixed
- Added missing blocks on README and fixed some nitpicks.

## [3.53.1] - 2020-04-01
### Fixed
- New README.md documentation

## [3.53.0] - 2020-03-31
### Added
- New block `sidebar-close-button`.

## [3.52.0] - 2020-03-26
### Added
- Support `installmentCriteria` prop in search query.

## [3.51.4] - 2020-03-20
### Fixed
- Problem that caused category filters to not appear when you were in page with category tree but all the other facets were in `hiddenFacets`.

## [3.51.3] - 2020-03-16
### Fixed
- Facets selection switch on mobile

## [3.51.2] - 2020-03-11
### Fixed
- Facets not showing "checked" when clicked on mobile.

## [3.51.1] - 2020-03-11
### Fixed
- Fixed mobile facets breaking when `preventRouteChange` wasn't being used.

### Added
- Updated `CODEOWNERS` file with responsible teams for each directory.

## [3.51.0] - 2020-03-09
### Added
- Prop `initiallyCollapsed` to `filter-navigator.v3`, allow filters start out collapsed.

## [3.50.2] - 2020-03-06
### Fixed
- Filter selection on FilterSidebar

## [3.50.1] - 2020-03-03
### Fixed
- Typo on `filterApplyButtonWrapper`.
- `trackingId` messages keys.

## [3.50.0] - 2020-03-02
### Added
- New search URL structure for specification filters and categories.

### Fixed
- Error causing the `productImpression` event to not be sent on some cases.

## [3.49.0] - 2020-02-27
### Added
- Handles to the wrapper of the action buttons of `FilterSidebar`.

## [3.48.0] - 2020-02-27
### Added
- `trackingId` prop to the Search Result.

## [3.47.3] - 2020-02-18
### Changed
- Import search queries directly.

## [3.47.2] - 2020-02-14
### Changed
- Make `search-result-layout.mobile` only come to runtime if device is of type mobile.

## [3.47.1] - 2020-02-10
### Fixed
- Error causing the `productImpression` event to not be sent on some cases.

## [3.47.0] - 2020-02-07 [YANKED]
### Changed
- New search URL structure for specification filters and categories.

## [3.46.1] - 2020-02-06
### Changed
- "Filter by" message to "Filtered by".

## [3.46.0] - 2020-02-04
### Added
- `filterTemplateOverflow` and `orderByText` handles.

## [3.45.2] - 2020-01-28
### Changed
- The fallback value of orderby label to empty string again.

## [3.45.1] - 2020-01-28
### Changed
- Ordination value of "Relevance" from empty string to `OrderByScoreDESC`.

## [3.45.0] - 2020-01-24
### Added
- Param `simulationBehavior` in search query.

## [3.44.1] - 2020-01-22
### Fixed
- Issues with the message change on some languages.

## [3.44.0] - 2020-01-17
### Added
- Two new css handles: `totalProductsMessage` and `filtersMessage`.

## [3.43.2] - 2020-01-13
### Fixed
- Prevent searchQuery object not reflecting new variables passed.

## [3.43.1] - 2020-01-13
### Fixed
- `maxItemsPerPage` description on README.

## [3.43.0] - 2020-01-13
### Changed
- Enable server side rendering.

## [3.42.1] - 2020-01-09
### Fixed
- Fix issues related to FilterNavigator loading state.

## [3.42.0] - 2020-01-04

### Added
- `showFacetQuantity` settings to `SearchResultFlexible` component. 

## [3.41.1] - 2020-01-02
### Fixed
- Added default value for `facetsBehavior` variable.

## [3.41.0] - 2020-01-02
### Added
- `facetsBehavior` on `SearchQuery`.

## [3.40.0] - 2019-12-27
### Added
- New prop `layout` to `filter-navigator.v3`.
- Allow `drawer` on `search-result-layout.mobile`.

## [3.39.10] - 2019-12-23
### Changed
- Change flexible layout render values to `client`.

## [3.39.9] - 2019-12-12
### Changed
- Some dependency versions. Update with `yarn upgrade`.

## [3.39.8] - 2019-12-04
### Added
- New CSS handles and updated some of the old ones. 

## [3.39.7] - 2019-12-04
### Fixed
- Make `search-result` respect the continuous C theorem.

## [3.39.6] - 2019-11-27
### Fixed
- Clear filters button on mobile.

## [3.39.5] - 2019-11-26
### Fixed
- Clicking on the `Apply` button on the filter side bar on mobile now closes the sidebar.

## [3.39.4] - 2019-11-21
### Added
- Search query default values

## [3.39.3] - 2019-11-19
### Fixed
- Fetch More button problem on `CustomQuery`.

## [3.39.2] - 2019-11-16
### Fixed
- Mininum of items to be displayed on `small` mobile layout mode should be 2, and always 1 when on `normal` mode.

## [3.39.1] - 2019-11-13
### Fixed
- Default value for `minItemWidth` prop should be `240`.

## [3.39.0] - 2019-11-12
### Added
- Support for responsive values on `maxItemsPerRow` prop from `Gallery` component.

### Fixed
- Inverted icons on `LayoutModeSwitcher`.

## [3.38.3] - 2019-11-12
### Changed
- Removes facets args logic

## [3.38.2] - 2019-11-11
### Fixed
- Issues with `preventRouteChange`

## [3.38.1] - 2019-11-11

## [3.38.0] - 2019-11-08
### Added
- `hiddenOptions` prop to `OrderBy`.

### Changed
- The title in `SelectionListOrderBy` now returns `''` instead of an error when the value is not found.

## [3.37.1] - 2019-11-08
### Fixed
- Double/Tripple spinner problem on loading.

## [3.37.0] - 2019-11-08
### Added
- Add support for skusFilter option in search query.

## [3.36.0] - 2019-11-07
### Changed
- Change the icon of expanded `Sort By` Dropdown.

## [3.35.10] - 2019-11-06
### Changed
- Separate product search query from facets query.

## [3.35.9] - 2019-10-31
### Changed
- Use `useQuery` hook.

## [3.35.8] - 2019-10-31
### Fixed
- `Show More` and `Show Previous` buttons vanishing before the results of the first or last pages were loaded.

## [3.35.7] - 2019-10-30
### Fixed
- Revert changes made on v3.35.2: Distribute space equally around products rendered by `Gallery` component when displaying less products than `maxItemsPerRow`.

## [3.35.6] - 2019-10-30
### Changed
- Refactored `useFetchMore` to use `useReducer`.

## [3.35.5] - 2019-10-29
### Fixed
- Search result pagination to work properly with `setQuery`.
- Loading interface on flexible Search Result when an operation used `setQUery`.

## [3.35.4] - 2019-10-23
### Fixed
- Invalid proptypes for `initiallyCollapsed` and `preventRouteChange`.

## [3.35.3] - 2019-10-16
### Fixed
- weird grid bug that caused the layout to have a fourth column on tablet screens.

## [3.35.2] - 2019-10-16
### Fix
- Distribute space equally around products rendered by `Gallery` component when displaying less products than `maxItemsPerRow`.

## [3.35.1] - 2019-10-15
### Fix
- Changes on price-range in the current search would not trigger a reload and would not provide any feedback to the user, resulting in bad UX.
- If a change on price-range was made in a certain search-result page, the pagination would not reset.

## [3.35.0] - 2019-10-11
### Added
- Prop `initiallyCollapsed`, to `filter-navigators`, to make filters start out collapsed.

## [3.34.0] - 2019-10-10
### Added
- Prop `preventRouteChange` to `filter-navigator.v2` and `filter-navigator.v3` to prevent changing the route when filters are selected, changing just the query string instead. This is intended for `search-result` blocks inserted on custom pages with static routes.

## [3.33.4] - 2019-10-10
### Fixed
- Mobile layouts could be broken if `minItemWidth` prop at the `Gallery` component received a small value.

## [3.33.3] - 2019-10-08
### Deprecated
- `infinite-scroll` on flexible search result

### Fixed
- README

## [3.33.2] - 2019-10-08

## [3.33.1] - 2019-10-04
### Fixed
-  problems with the `fetchMore` that is used on the useFetchMore by handling possible errors

## [3.33.0] - 2019-10-02
### Added
- Loading more results of a search result now changes the url. The back and forward feature is working properly to consider the page the user was last in.
- Added a `show previous` button for when the user is not seeing the search results from the first item.

### Fixed
- Load More feature to consider the current page the user is in.
- Bug that caused productCount of the `fetchMoreButton` to appear before the recordsFiltered was loaded.

## [3.32.3] - 2019-09-23
### Added
- Added `search-blog-articles-list` and `tab-layout` to allowed blocks for custom layouts.

## [3.32.2] - 2019-09-19
### Fixed
- Cleanup unused dependency.

## [3.32.1] - 2019-09-19
### Fixed
- `search-result-layout.customQuery` breaking in site-editor.

## [3.32.0] - 2019-09-13

### Added
- Added `search-blog-articles-preview` to allowed blocks.

## [3.31.3] - 2019-09-12
### Fixed
- Stop skipping the search metatada query.

## [3.31.2] - 2019-09-11
### Fix
- Make Filter-navigator appear on v1.

## [3.31.1] - 2019-09-10

### Changed
- Make shelf render strategy `client`, i.e. component assets are fetched client-side with same priority as server-side blocks.

## [3.31.0] - 2019-09-10

## [3.30.2] - 2019-09-09
### Fixed
- Only block department navigation when a category facet is present.

## [3.30.1] - 2019-09-02
### Changed
- Do SearchMetadata query on SSR to get title and description.

## [3.30.0] - 2019-08-29
### Changed
- Make search query run only on client-side

## [3.29.2] - 2019-08-29

## [3.29.1] - 2019-08-27
### Fixed
- Fix rendering in IE11 by changing how to import from `react-spring` and upgrading `@vtex/css-handles`.

## [3.29.0] - 2019-08-20
### Added
- New CSS handles:
  - `filterContainer`
  - `filterContainer--title`
  - `filterContainer--selectedFilters`
  - `filterContainer--c`
  - `filterContainer--b`
  - `filterContainer--priceRange`
  - `filterContainer--` + FACET_TYPE
  - `filterItem--` + FACET_VALUE

## [3.28.0] - 2019-08-19

### Added

- `showProductsCount` prop that controls if the number of products on the page and total quantity of items in a search result is displayed under the `show more` button.

## [3.27.0] - 2019-08-14
### Added
- Add `rich-text` to `search-result` block.

### Fixed
- Style issues in mobile.

## [3.26.0] - 2019-08-13

### Changed
- Make search results render strategy `lazy`, i.e. component is only fetched client-side.

## [3.25.2] - 2019-08-07

### Changed

- `SearchResult` to support breadcrumbs on mobile

### Added

- Some test support through mocks

## [3.25.1] - 2019-08-06

### Changed
- Use product parsing logic from `product-summary`.


## [3.25.0] - 2019-08-01

### Added

- Enable the user to control wheter the `LayoutModeSwitcher` component is rendered. If only a `mode1` is provided to `mobileLayout`, the switcher will not be shown.
- Better documentation on the use of `mobileLayout` prop.

## [3.24.0] - 2019-08-01
### Fixed
- Fixed the style of the "sort by" dropdown found on the search results.

## [3.23.1] - 2019-07-31
### Fixed
- Issue with IntersectionObserver on Safari 12.0, making the whole page crash. A polyfill has been added for the time being, while the fix for the issue is not published on polyfill.io.

## [3.23.0] - 2019-07-31
### Added
- Prop `preventRouteChange` on legacy FilterNavigator (for now), to prevent changing the route when filters are selected, changing just the query string instead. This is intended for `search-result` blocks inserted on custom pages with static routes.

## [3.22.12] - 2019-07-31
### Fixed
- Price Range now works properly on mobile

## [3.22.11] - 2019-07-30
### Fixed
- On SearchQuery, search with errors from server will not display previous results.

## [3.22.10] - 2019-07-26
### Fixed
- Fix breaking search in cateogry page when setting a price range.

## [3.22.9] - 2019-07-26
### Fixed
- Use format-currency app to format price in PriceRange.

## [3.22.8] - 2019-07-25
### Changed
- removed the "(default)" from default options

## [3.22.7] - 2019-07-24

## [3.22.6] - 2019-07-23
### Changed
- Added order by relevance to the order types
- The default value of `orderByField` is now order by relevance.

## [3.22.5] - 2019-07-09
### Changed
- Send product impressions event in lists and only send them when search-result row is viewed.

## [3.22.4] - 2019-06-27

### Fixed
- Build assets with new builder hub.

## [3.22.3] - 2019-06-26
### Added
- CSS class `filterItem--selected` for selected filter items.

## [3.22.2] - 2019-06-24

### Fixed

- Issues with selecting categories in mobile.

## [3.22.1] - 2019-06-21

### Changed

- Create SearchQuery component and render it inside LocalQuery.

## [3.22.0] - 2019-06-19

### Added

- Support for shop-review-interfaces app to display block on search results page.

## [3.21.7] - 2019-06-18

### Fixed

- Issue of filters not appearing on non categories search pages, with LocalQuery component.

## [3.21.6] - 2019-06-17

### Added

- More css classes for department filters and categories.

## [3.21.5] - 2019-06-11

### Fixed

- Move `Collapsible` component to `NoSSR` to prevent crashes on SSR because of springs animation lib.

## [3.21.4] - 2019-06-10

### Fixed

- Fix priceRange using old `Slug` field. Change to `slug`.

## [3.21.3] - 2019-06-04

### Changed

- Changed rules to display in `search-title`. Will now check if its a product cluster search, brand page, category, or a full text search.

## [3.21.2] - 2019-06-03

### Added

- Block class.

## [3.21.1] - 2019-05-28

### Fixed

- Filter navigation that have set only not hide categories.

## [3.21.0] - 2019-05-27

### Added

- `filter-navigator.v2` using the Category Tree to show categories/departments in a correct hierarchy.

- `filter-navigator.v1` for whoever want to keep using the current `filter-navigator` (it will not be updated anymore).

### Changed

- Update category filters appearance.

### Deprecated

- `filter-navigator` block. If you want to keep your store up to date, use `filter-navigator.v2` for now.

## [3.20.1] - 2019-05-27

### Fixed

- Typo in default value of schema.

## [3.20.0] - 2019-05-27

### Changed

- Migrate to pixel-manager v1.

## [3.19.2] - 2019-05-24

### Fixed

- Flickering behaviour triggered by ResizeDetector.

## [3.19.1] - 2019-05-23

### Fixed

- Hides filters when there are no filters available.

## [3.19.0] - 2019-05-23

### Added

- Send productImpression events to Pixel Manager.

### Fixed

- Fixed bug when pushing productClick event (param expected was not being sent)

## [3.18.1] - 2019-05-20

### Changed

- Use new breadcrumb resolver on productSearch.
- Get Search Title from last breadcrumb name returned.

## [3.18.0] - 2019-05-15

### Added

- Send productClick events to Pixel Manager.

## [3.17.8] - 2019-05-10

### Fixed

- Fixed bug where the extension would break if no title was found.

## [3.17.7] - 2019-05-10

### Fixed

- Not found page being shown without filter navigator when the cause for the
  lack of products is an applied filter.

## [3.17.6] - 2019-05-10

### Fixed

- Fetch more on `LocalQuery` was always fetching 10 more items, and not fetching the next maxItemsPerPage items.

## [3.17.5] - 2019-05-10

### Fixed

- Displays the correct product cluster title, instead of its id.

## [3.17.4] - 2019-05-10

### Fixed

- Refrain from throwing error when LayoutModeSwitcher icon is not found.

## [3.17.3] - 2019-05-10

### Fixed

- Vendas to Ventas in es.json

## [3.17.2] - 2019-05-08

### Fixed

- Use `setQuery` method when selecting a sort by option.

## [3.17.1] - 2019-05-07

### Fixed

- Correctly slugify facets when comparing if they are selected.

## [3.17.0] - 2019-05-07

### Changed

- Generates category to use as prop categoryTree in breadcrumb

## [3.16.2] - 2019-05-07

### Added

- Prop `hideUnavailableItems` to querySchema and use it on `LocalQuery`.

## [3.16.1] - 2019-05-06

## [3.16.0] - 2019-05-06

### Fixed

- Remove the default 'Sort By' option on `OrderBy` component.

## [3.15.5] - 2019-05-06

### Fixed

- Selected filters not accounting for map parameter.

## [3.15.4] - 2019-05-06

### Fixed

- Make `LocalQuery` use productSearchV2 and set default items per page.

## [3.15.3] - 2019-05-06

### Fixed

- Decode gallery title.

## [3.15.2] - 2019-05-03

### Fixed

- Infinite loading on fetch more.

## [3.15.1] - 2019-05-01

### Changed

- Use `recordsFiltered` value from productSearch query.

## [3.15.0] - 2019-04-26

### Changed

- Use filters value instead of encoded link on navigate.

## [3.14.1] - 2019-04-26

### Fixed

- Messages on not found page.

## [3.14.0] - 2019-04-26

### Changed

- Remove usage of `rest` parameter.

## [3.13.4] - 2019-04-26

### Fixed

- undefined error in fetch more.

## [3.13.3] - 2019-04-25

### Fixed

- `TotalProducts` proptype error.

## [3.13.2] - 2019-04-12

### Changed

- Removed option `showTitle` on schema.

## [3.13.1] - 2019-04-10

## [3.13.0] - 2019-04-10

### Added

- Add `search-title` block for displaying category or search term.

## [3.12.14] - 2019-04-10

### Changed

- Using `store-icons` instead of `dreamstore-icons`.

## [3.12.13] - 2019-04-10

### Changed

- Add new CSS handle `filterContent`.

## [3.12.12] - 2019-04-10

### Fixed

- Error when trying to read properties from facets while loading.

## [3.12.11] - 2019-03-29

### Fixed

- Added the department before each category to pass it to `Breadcrubms`.

## [3.12.10] - 2019-03-29

### Fixed

- Remove Product summary schema from Search Result.

## [3.12.9] - 2019-03-27

### Fixed

- Pass the correct category structure to `Breadcrumbs`.

## [3.12.8] - 2019-03-27

### Fixed

- Fix outside click in mobile `OrderBy` dropdown.

## [3.12.7] - 2019-03-19

### Added

- Resize images to width 500px.

## [3.12.6] - 2019-03-14

### Changed

- Change language files to most generic.

## [3.12.5] - 2019-03-12

### Fixed

- Fix `Gallery` small layout not working properly.

## [3.12.4] - 2019-03-07

### Fixed

- Orderby Button with fixed width in search result grid.

### Added

- Add `react-testing-library` and snapshots.

## [3.12.3] - 2019-02-25

### Fixed

- OrderBy using none instead of invalid value

## [3.12.2] - 2019-02-25

## [3.12.1] - 2019-02-25

### Fixed

- Add default orderBy to relevance

## [3.12.0] - 2019-02-14

### Changed

- Padding between items are now set using tachyons. Also add gap in schema.

## [3.11.9] - 2019-02-14

## [3.11.8] - 2019-02-14

## [3.11.7] - 2019-02-12

### Fixed

- Fix misuse of `layoutMode` prop in desktop view.

### Changed

- Rename `layoutMode` to `mobileLayoutMode` to avoid using it in desktop view.

## [3.11.6] - 2019-02-12

### Fixed

- Normalize the height of `product-summary`.

## [3.11.5] - 2019-02-11

### Changed

- Use flex instead grid in `Gallery` and spaces between `GalleryItems` can be customized.

## [3.11.4] - 2019-02-06

### Fixed

- Fix overflowing items in the `Gallery`.

## [3.11.3] - 2019-02-04

### Fixed

- Fix gallery layout when in mobile mode.

## [3.11.2] - 2019-02-01

## [3.11.1] - 2019-01-31

### Fixed

- Pass `scrollTop` param to list, fix `fetchMore` query and fix layout when more items are loaded.

## [3.11.0] - 2019-01-30

### Changed

- Use icons from `vtex.dreamstore-icons`.

## [3.10.3] - 2019-01-30

### Fixed

- Normalized product sorts SKU's instead of summing their `AvailableQuantity`.

## [3.10.2] - 2019-01-29

### Fixed

- Use correctly the grid API.

## [3.10.1] - 2019-01-29

### Changed

- Centralize gallery when filter-navigator isn't defined.

## [3.10.0] - 2019-01-29

### Added

- Add `order-by` and `total-products` on `search-result` interface.

### Changed

- Now, `filter-navigator` block is an allowed block.

## [3.9.1] - 2019-01-26

### Fixed

- Normalized product now get the sum of skus `AvailableQuantity`.

## [3.9.0] - 2019-01-22

## [3.8.2] - 2019-01-18

### Changed

- Adjust the way to import render-runtime components.

## [3.8.1] - 2019-01-18

## [3.8.0] - 2019-01-18

### Changed

- Update React builder to 3.x.
- Bump vtex.styleguide to 9.x.

## [3.7.0] - 2019-01-17

### Added

- Support to CSS Modules.

## [3.6.1] - 2019-01-11

### Changed

- Add `Container` for adjusting search result to store padding.

## [3.6.0] - 2019-01-09

### Changed

- Bye `pages.json`! Welcome `store-builder`.

## [3.5.0] - 2018-12-21

### Changed

- Use `react-virtualized` to render gallery items.

## [3.4.4] - 2018-12-21

### Fixed

- Search bar items alignment.

## [3.4.3] - 2018-12-21

### Fixed

- Fix Scroll on filter sidebar items.

## [3.4.2] - 2018-12-21

### Fixed

- Show more button must disappear when there is no more products.

## [3.4.1] - 2018-12-20

### Fixed

- Close dropdown sort when click outside of the dropdown box.

## [3.4.0] - 2018-12-19

### Changed

- New layout and behavior of search result filter

## [3.3.0] - 2018-12-18

### Added

- Support to messages builder.

## [3.2.0] - 2018-12-11

### Changed

- Sort option on mobile to a dropdown button.

### Fixed

- Improve code quality in `OrderBy.js`.

## [3.1.0] - 2018-12-10

### Changed

- Product count will be displayed below filter and order buttons.

## [3.0.1] - 2018-12-05

### Fixed

- Fix alignment of `LayoutModeSwitcher`.

## [3.0.0] - 2018-12-04

### Fixed

- Add default behavoir when `querySchema` comes undefined from server.

### Added

- Add new mobile design.
- Not found page component.
- Get switcher layout modes by schema.

### Changed

- Replace tachyons classes with design tokens.
- Paddings and margins to match other components.
- Update loading to use an overlay instead of content loader after initial mount.

## [2.4.1] - 2018-11-22

### Changed

- Changes to search scroll the window to the top of the search result

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
