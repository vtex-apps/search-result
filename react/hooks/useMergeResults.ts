import { useEffect, useMemo, useState } from 'react'
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
  const searchVariables = props?.searchQuery?.variables

  // Armed only while the search is loading, so the wait can extend an existing
  // loader but never turn a rendered result back into one.
  const [isWaitingForAds, setIsWaitingForAds] = useState(
    () => isFirstPage && isSearchLoading
  )

  useEffect(() => {
    if (isFirstPage && isSearchLoading) {
      setIsWaitingForAds(true)
    }
  }, [searchVariables, isFirstPage, isSearchLoading])

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

    if (isFirstPage && isWaitingForAds && newProps.searchQuery) {
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
  }, [props, sponsoredSearchResult, isFirstPage, isWaitingForAds])

  return mergedProps
}

export default useMergeResults
