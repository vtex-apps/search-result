# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
 - The `search-bar` on whitelist in the `search-not-found-layout`
 
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
