import { useEffect, useMemo, useRef, useState } from 'react'
import type { UseAdsReturn } from '@vtex/ads-react'

interface UseMergeResultsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sponsoredSearchResult: UseAdsReturn<any>
}

const ADS_MAX_WAIT_MS = 2000

const useMergeResults = ({
  props,
  sponsoredSearchResult,
}: UseMergeResultsProps) => {
  const isFirstPage = Boolean(
    (props as unknown as { from?: number })?.from === 0 ||
      (props as unknown as { page?: number })?.page === 1
  )

  const isAdsLoading = sponsoredSearchResult?.isLoading ?? false
  const isSearchLoading = props?.searchQuery?.loading ?? false
  const searchVariablesKey = JSON.stringify(props?.searchQuery?.variables)

  // Armed by the effect below, never on the first render.
  const [isWaitingForAds, setIsWaitingForAds] = useState(false)

  // Search whose products are already on screen; it is never held again.
  const shownForSearchRef = useRef<string | undefined>(undefined)
  const alreadyShown = shownForSearchRef.current === searchVariablesKey

  useEffect(() => {
    if (isFirstPage && isSearchLoading && !alreadyShown) {
      setIsWaitingForAds(true)
    }
  }, [searchVariablesKey, isFirstPage, isSearchLoading, alreadyShown])

  // Hard limit for the wait.
  useEffect(() => {
    if (!isWaitingForAds) {
      return
    }

    const timeoutId = setTimeout(() => {
      setIsWaitingForAds(false)
    }, ADS_MAX_WAIT_MS)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [isWaitingForAds])

  useEffect(() => {
    // Ads settled and search resolved: nothing left to wait for.
    if (isWaitingForAds && !isAdsLoading && !isSearchLoading) {
      setIsWaitingForAds(false)
    }
  }, [isWaitingForAds, isAdsLoading, isSearchLoading])

  const mergedProps = useMemo(() => {
    const newProps = { ...props }

    if (
      isFirstPage &&
      isWaitingForAds &&
      !alreadyShown &&
      newProps.searchQuery
    ) {
      // Hold the organic result so sponsored products enter in the same paint.
      newProps.searchQuery = {
        ...newProps.searchQuery,
        loading: true,
        products: [],
      }

      if (newProps.searchQuery.data) {
        newProps.searchQuery.data = {
          ...newProps.searchQuery.data,
          products: [],
          productSearch: {
            ...newProps.searchQuery.data.productSearch,
            products: [],
          },
        }
      }
    } else if (
      isFirstPage &&
      sponsoredSearchResult?.ads?.length &&
      newProps.searchQuery
    ) {
      const sponsoredProducts = sponsoredSearchResult.ads.map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (ad: any) => ({
          ...(ad.product ?? ad),
          advertisement: ad.advertisement,
          cacheId: `ad-${ad.product?.cacheId ?? ''}`,
        })
      )

      const mergedProducts = [
        ...sponsoredProducts,
        ...(newProps.searchQuery.products || []),
      ]

      newProps.searchQuery = {
        ...newProps.searchQuery,
        data: {
          ...newProps.searchQuery.data,
          products: mergedProducts,
          productSearch: {
            ...newProps.searchQuery.data?.productSearch,
            products: mergedProducts,
          },
        },
        products: mergedProducts,
      }
    }

    return newProps
  }, [props, sponsoredSearchResult, isFirstPage, isWaitingForAds, alreadyShown])

  const hasProductsOnScreen =
    (mergedProps?.searchQuery?.products?.length ?? 0) > 0

  useEffect(() => {
    if (hasProductsOnScreen) {
      shownForSearchRef.current = searchVariablesKey
    }
  }, [hasProductsOnScreen, searchVariablesKey])

  return mergedProps
}

export default useMergeResults
