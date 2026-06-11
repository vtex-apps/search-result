import { useEffect, useRef } from 'react'

interface UseLazyItemsRearmArgs {
  /** Current number of products held by the productSearch cache entry. */
  productsCount: number
  /** Size of the initial lazy window (INITIAL_ITEMS_LIMIT when lazy is on). */
  itemsLimit: number
  maxItemsPerPage: number
  /** Offset of the first item of the current page (0 on the first page). */
  from: number
  /** Whether the lazy search query mode is active. */
  shouldLimitItems: boolean
  setLazyItemsRemaining: (remaining: number) => void
}

/**
 * Re-arms the lazy-items refill after an external refetch resets the cached
 * product list back to the initial lazy window.
 *
 * With `enableLazySearchQuery`, `SearchQuery` fetches the first
 * `INITIAL_ITEMS_LIMIT` items and lazily refills the rest of the page once.
 * When another app (e.g. `vtex.delivery-promise-components` on a location
 * change) refetches the observable query, Apollo replaces the cache entry with
 * only the initial window — but `lazyItemsRemaining` is already 0, so items
 * `itemsLimit..maxItemsPerPage-1` would never be fetched again, leaving a
 * permanent gap before the next "load more" page. Detecting the list shrinking
 * back to the initial window re-arms the refill.
 */
export const useLazyItemsRearm = ({
  productsCount,
  itemsLimit,
  maxItemsPerPage,
  from,
  shouldLimitItems,
  setLazyItemsRemaining,
}: UseLazyItemsRearmArgs) => {
  const previousCountRef = useRef(productsCount)

  useEffect(() => {
    const previousCount = previousCountRef.current

    previousCountRef.current = productsCount

    // Only the first page window is refilled with `from`-relative offsets;
    // off page 1 the refill window would not match the refreshed list.
    if (!shouldLimitItems || from !== 0) {
      return
    }

    const shrankBackToInitialWindow =
      previousCount > itemsLimit &&
      productsCount > 0 &&
      productsCount <= itemsLimit

    if (shrankBackToInitialWindow) {
      setLazyItemsRemaining(maxItemsPerPage - itemsLimit)
    }
  }, [
    productsCount,
    itemsLimit,
    maxItemsPerPage,
    from,
    shouldLimitItems,
    setLazyItemsRemaining,
  ])
}
