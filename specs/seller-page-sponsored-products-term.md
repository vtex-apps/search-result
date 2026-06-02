---
status: Approved
---

# Seller Page: Sponsored Products Term Fallback

## Business Context

### Problem

On seller pages (e.g. `/ofertec?map=sellerName` or `/shpseller382?map=seller`), the sponsored products request is sent with `context: "home"` instead of `context: "search"`. This causes the ads system to return unrelated products — not filtered by the seller context.

### Root Cause

`SearchResultLayout` calls `useAds` with `term: searchQuery?.variables?.fullText`. On seller pages, `fullText` is always `undefined` because the seller name is encoded as a facet filter (`map=sellerName` or `map=seller`), not as a full-text search term (`map=ft`). The `@vtex/ads-core` SDK determines context solely from `term` — when it is `undefined`, it defaults to `"home"`.

The correct term (`"ofertec"`, `"shpseller382"`) is available in `route.params.term` from `useRuntime()`, but `SearchResultLayout` does not read it.

### Seller page variants

| URL pattern | map value | params.term | Origin |
|---|---|---|---|
| `/ofertec?map=sellerName` | `sellerName` | `ofertec` | IS admin redirect (manual) |
| `/shpseller382?map=seller` | `seller` | `shpseller382` | Native VTEX seller store URL |

### Goal

Pass the correct search term to `useAds` on seller pages so sponsored products requests use `context: "search"` with the seller name as `term`.

### User Stories

**As a store running ads on seller pages,**  
I want sponsored product requests to use the correct search context,  
so that ads are relevant to the seller being browsed.

#### Acceptance Criteria

**Given** a user navigates to a seller page (`map=sellerName` or `map=seller`)  
**When** `SearchResultLayout` calls `useAds`  
**Then** `term` is set to `route.params.term` (the seller name/id)  
**And** the ads request is sent with `context: "search"` and the correct term

**Given** a user navigates to a regular full-text search page (`map=ft`)  
**When** `SearchResultLayout` calls `useAds`  
**Then** `term` is set to `searchQuery.variables.fullText` (unchanged behavior)

**Given** neither `fullText` nor `route.params.term` is available  
**When** `SearchResultLayout` calls `useAds`  
**Then** `term` is `undefined` (unchanged fallback behavior)

### Key Scenarios

| Scenario | Pre-condition | Steps | Expected result |
|---|---|---|---|
| Seller page via IS redirect | `fullText=undefined`, `route.params.term="ofertec"`, `map=sellerName` | Navigate to `/ofertec?map=sellerName` | `useAds` called with `term: "ofertec"` |
| Seller store page (native) | `fullText=undefined`, `route.params.term="shpseller382"`, `map=seller` | Navigate to `/shpseller382?map=seller` | `useAds` called with `term: "shpseller382"` |
| Regular search | `fullText="laptop"`, `route.params.term="laptop"`, `map=ft` | Search for "laptop" | `useAds` called with `term: "laptop"` (from fullText) |
| No term available | `fullText=undefined`, `route.params.term=undefined` | Navigate to category page | `useAds` called with `term: undefined` |

---

## Arch Decisions

### Approach

Add `useRuntime()` to `SearchResultLayout` and use `route.params.term` as a fallback when `searchQuery.variables.fullText` is `undefined`.

```javascript
const { route } = useRuntime()

useAds({
  term: searchQuery?.variables?.fullText ?? route?.params?.term,
  ...
})
```

### Alternatives considered

| Alternative | Reason rejected |
|---|---|
| Fix in `@vtex/ads-core` facetsAdapter (add `sellerName` extraction) | SDK change requires separate release cycle; doesn't fix the root issue (term not passed) |
| Fix in `vtex.store/VTEXAdsProvider` (pass pageContext to AdsProvider) | Requires changes in two repos (`ads-js` + `vtex.store`); more invasive for a minimal fix |
| Fix in `vtex.vtex-ads` usePageContext | Different ads system (banners, not product ads); separate concern |

### Decision

Minimal fix in `SearchResultLayout.js`. `useRuntime` is already a dependency of `vtex.render-runtime` (used by `useChildBlock` and `ExtensionPoint` in the same file). No new dependencies required. The `??` nullish coalescing ensures `fullText` takes precedence — existing behavior for all non-seller pages is unchanged.

---

## Technical Contract

### Changed file

`react/SearchResultLayout.js`

### Change

```diff
- import { useChildBlock, ExtensionPoint } from 'vtex.render-runtime'
+ import { useChildBlock, ExtensionPoint, useRuntime } from 'vtex.render-runtime'

  const SearchResultLayout = props => {
    const { searchQuery } = props
    const hasMobileBlock = !!useChildBlock({ id: 'search-result-layout.mobile' })
    const hasCustomNotFound = !!useChildBlock({ id: 'search-not-found-layout' })
    const { isMobile } = useDevice()
+   const { route } = useRuntime()

    const sponsoredSearchResult = useAds({
      placement: 'top_search',
      type: 'product',
      amount: props?.sponsoredCount ?? 3,
-     term: searchQuery?.variables?.fullText,
+     term: searchQuery?.variables?.fullText ?? route?.params?.term,
      selectedFacets: searchQuery?.variables?.selectedFacets ?? [],
    })
```

### Behavior contract

| Input | `fullText` | `route.params.term` | `term` passed to `useAds` |
|---|---|---|---|
| Full-text search | `"laptop"` | `"laptop"` | `"laptop"` |
| Seller page (sellerName) | `undefined` | `"ofertec"` | `"ofertec"` |
| Seller page (seller) | `undefined` | `"shpseller382"` | `"shpseller382"` |
| Category/department page | `undefined` | `undefined` | `undefined` |

### New test

`react/__tests__/SearchResultLayout.test.js`

Covers:
- `useAds` receives `route.params.term` when `fullText` is undefined (seller page)
- `useAds` receives `fullText` when both are present (regular search)
- `useAds` receives `undefined` when neither is present
