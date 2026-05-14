<!-- managed-by: golden-path v1 -->
# Data Model

`vtex.search-result` owns no runtime data. The authoritative model is:

- **GraphQL schema:** [`vtex.search-graphql`](https://github.com/vtex-apps/search-graphql).
- **Resolver behavior:** [`vtex.search-resolver`](https://github.com/vtex-apps/search-resolver).
- **Block configuration contract:** [`store/interfaces.json`](../store/interfaces.json), [`store/blocks.json`](../store/blocks.json), [`store/contentSchemas.json`](../store/contentSchemas.json).

## Block contract

```jsonc
// store/blocks.json (selected — see file for the full set)
{
  "search-result": {
    "blocks": [
      "filter-navigator",
      "gallery",
      "not-found",
      "breadcrumb",
      "total-products",
      "order-by"
    ]
  },
  "gallery": {
    "blocks": ["product-summary"]
  }
}
```

```jsonc
// store/interfaces.json (selected)
{
  "search-result": {
    "allowed": [
      "not-found", "breadcrumb", "filter-navigator", "total-products",
      "order-by", "search-title", "rich-text", "search-products-progress-bar"
    ],
    "required": ["gallery"],
    "component": "index"
  },
  "filter-navigator":     { "component": "FilterNavigatorLegacy" },
  "filter-navigator.v1":  { "component": "FilterNavigatorLegacy" },
  "filter-navigator.v2":  { "component": "FilterNavigator", "allowed": ["shop-review-summary", "sidebar-close-button"] },
  "gallery":              { "allowed": ["product-summary"], "component": "Gallery" },
  "gallery-layout-switcher": { "component": "GalleryLayoutSwitcher", "composition": "children" },
  "gallery-layout-option":   { "component": "GalleryLayoutOption", "composition": "children" },
  "not-found":            { "allowed": ["shelf"], "component": "NotFoundSearch" },
  // ... many more
}
```

## React component map

Block component names in `store/interfaces.json` resolve to exports in [`react/index.js`](../react/index.js). The repository mixes `.tsx`, `.ts`, and legacy `.js` files; the build is driven by the `react` builder (`builders.react: 3.x` in `manifest.json`).

| Block | Component | File |
|---|---|---|
| `search-result` | `index` | `react/index.js` (`SearchResult` + `SearchResultContainer`) |
| `gallery` | `Gallery` | `react/Gallery.tsx` |
| (legacy gallery) | `GalleryLegacy` | `react/GalleryLegacy.tsx` |
| `filter-navigator` / `.v1` | `FilterNavigatorLegacy` | `react/FilterNavigatorLegacy.js` |
| `filter-navigator.v2` | `FilterNavigator` | `react/FilterNavigator.js` |
| (flexible variant) | `FilterNavigatorFlexible` | `react/FilterNavigatorFlexible.js` |
| `gallery-layout-switcher` | `GalleryLayoutSwitcher` | `react/GalleryLayoutSwitcher.tsx` |
| `gallery-layout-option` | `GalleryLayoutOption` | `react/GalleryLayoutOption.tsx` |
| `order-by` | `OrderBy` | `react/OrderBy.js` |
| `total-products` | `TotalProducts` | `react/TotalProducts.js` |
| `search-title` | `SearchTitle` | `react/SearchTitle.js` |
| `not-found` | `NotFoundSearch` | `react/NotFoundSearch.js` |
| `search-result-layout` | `SearchResultLayout` | `react/SearchResultLayout.js` |
| `search-result-layout.customQuery` | `SearchResultLayoutCustomQuery` | `react/SearchResultLayoutCustomQuery.js` |
| `search-content` | `SearchContent` | `react/SearchContent.js` |
| `search-fetch-more` | `FetchMore` | `react/FetchMore.js` |
| `search-fetch-previous` | `FetchPrevious` | `react/FetchPrevious.js` |
| `search-layout-switcher` | `LayoutModeSwitcherFlexible` | `react/LayoutModeSwitcherFlexible.js` |

(See `store/interfaces.json` for the full list — there are several flexible-layout variants per block.)

## State and context

- **`SearchPageContext`** (from `vtex.search-page-context`) carries the search state (`query`, `totalProducts`, results, loading) down to descendant blocks.
- **`FilterNavigatorContext`** (`react/FilterNavigatorContext.js`) is the local context for filter state used by the v2 navigator family.
- **`LocalQuery`** (`react/components/LocalQuery`) loads queries via Apollo when the `search-result` block is mounted standalone (without a parent layout providing the data).

## Runtime dependencies (`manifest.json`)

The app depends on many storefront apps; the most central are:

| Dep | Use |
|---|---|
| `vtex.store-graphql` | The catalog/search GraphQL schema consumed at runtime |
| `vtex.store-resources` | Apollo client setup + shared queries |
| `vtex.store-components` | UI building blocks |
| `vtex.product-summary` | Product card renderer used inside `gallery` |
| `vtex.shelf` | Horizontal shelf used by `not-found` |
| `vtex.search-page-context` | Cross-block search state |
| `vtex.pixel-manager` | Analytics event emission |
| `vtex.product-list-context` | List-level context |
| `vtex.flex-layout` | Flexible-layout primitives |
| `vtex.tab-layout` | Tabbed layouts |
| `vtex.breadcrumb` | Breadcrumb block |
| `vtex.styleguide` | UI primitives |
| `vtex.css-handles` | Theme-customization anchors |
| `vtex.native-types` | Site Editor input types |
| `vtex.responsive-values` | Responsive prop handling |
| `vtex.format-currency` | Currency formatting |

## Test surface

- Tests live in `react/__tests__/` and run via `yarn test` → `vtex-test-tools test`.
- Notable suites:
  - `FilterNavigator.test.js`
  - `Gallery.test.js`
  - `OrderBy.test.js`
  - `SearchFooter.test.js`
  - `AccordionFilterContainer.test.js`
  - `useFacetNavigation.test.js`
- Coverage threshold (60%) is declared under the `jest` key in `react/package.json`. `vtex-test-tools` reads this via the standard Jest resolution.
