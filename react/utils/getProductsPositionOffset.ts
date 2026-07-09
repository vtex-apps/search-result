interface GetProductsPositionOffsetParams {
  /** Live offset tracked by useFetchMore (updates on fetch previous). */
  from: number
  /** Offset used in the initial GraphQL query (`searchQuery.variables.from`). */
  queryFrom: number
  maxItemsPerPage: number
  productsCount: number
  /** Current page from the URL query string. */
  urlPage: number
}

/**
 * Resolves the 1-based rank offset for the first product currently rendered in
 * the gallery. `useFetchMore`'s `from` is authoritative after fetch-previous,
 * but on a direct `?page=N` load the reducer may still be seeded at 0 while
 * the query and URL already point to a later page.
 */
export function getProductsPositionOffset({
  from,
  queryFrom,
  maxItemsPerPage,
  productsCount,
  urlPage,
}: GetProductsPositionOffsetParams): number {
  if (from > 0) {
    return from
  }

  const hasSinglePageInDom =
    productsCount > 0 && productsCount <= maxItemsPerPage

  if (queryFrom > 0 && hasSinglePageInDom) {
    return queryFrom
  }

  const urlFrom = (urlPage - 1) * maxItemsPerPage

  if (urlFrom > 0 && hasSinglePageInDom) {
    return urlFrom
  }

  return from
}
