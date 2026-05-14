<!-- managed-by: golden-path v1 -->
# Glossary

Domain vocabulary used in `vtex.search-result`.

| Term | Definition |
|---|---|
| **PLP (Product Listing Page)** | The shopper-facing search/category page. This app provides the bulk of its blocks. |
| **Block** | A composable Store Framework unit declared in `store/interfaces.json` and instantiated via `store/blocks.json`. Each block maps to a React component exported by `react/index.js`. |
| **Interface** | The block declaration: `{ component, allowed, required, composition, content }`. Lives in `store/interfaces.json`. |
| **Content Schema** | JSON Schema describing the props a block can be configured with via Site Editor. Lives in `store/contentSchemas.json`. |
| **Gallery** | The block (`gallery`) that renders the product grid. Components: `Gallery.tsx`, `GalleryLegacy.tsx`, `GalleryLayout.tsx`, `GalleryLayoutOption.tsx`, `GalleryLayoutSwitcher.tsx`. |
| **Filter Navigator** | Faceted filtering blocks. Three implementations coexist:<br/>• `FilterNavigatorLegacy` — `filter-navigator.v1` and the unversioned `filter-navigator` alias<br/>• `FilterNavigator` — `filter-navigator.v2`, allows `shop-review-summary` and `sidebar-close-button`<br/>• `FilterNavigatorFlexible` — flexible-layout-aware variant |
| **Layout Switcher** | The block (`gallery-layout-switcher`) that lets shoppers toggle layout modes. Composed via `children`. |
| **Search Result Layout** | Container block (`search-result-layout`) for the new flexible layout. Allows `search-result-layout.desktop`, `.mobile`, and `search-not-found-layout`. Companion `search-result-layout.customQuery` accepts the same children. |
| **Search Content** | Block (`search-content`) requiring `gallery` + `not-found`. Wraps the SSR/CSR boundary. |
| **`vtex-test-tools`** | VTEX's Jest wrapper used by `react/package.json`'s `test` script. Provides preconfigured Jest + Babel + jsdom setup. There is no separate `jest.config.js`. |
| **`vtex.search-page-context`** | Dependency providing `SearchPageContext` — exposes search state (query, total, results) to descendant blocks via React context. |
| **`vtex.product-summary`** / **`vtex.shelf`** | Dependencies providing the product card / shelf renderers that this app's gallery uses. |
| **`vtex.store-graphql`** | Dependency providing the GraphQL schema for store-side queries (productSearch, facets, etc. — wraps `vtex.search-graphql`). |
| **Pixel Manager** | `vtex.pixel-manager` — fires storefront analytics events (`productClick`, `productImpression`, etc.) when shoppers interact with gallery items. |
| **Pickup-in-point Preference** | `localStorage['vtex.search.pickupInPoint']` — shared key with `vtex.delivery-promise-components`. Persisted pickup-point selection that adjusts PLP filtering. |
