import { useEffect, useMemo, useState } from 'react'
import type { UseAdsReturn } from '@vtex/ads-react'

interface UseMergeResultsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sponsoredSearchResult: UseAdsReturn<any>
}

const useMergeResults = ({
  props,
  sponsoredSearchResult,
}: UseMergeResultsProps) => {
  const [holdOrganic, setHoldOrganic] = useState(false)

  const isFirstPage = Boolean(
    (props as unknown as { from?: number })?.from === 0 ||
      (props as unknown as { page?: number })?.page === 1
  )

  const isAdsLoading = sponsoredSearchResult?.isLoading ?? false

  useEffect(() => {
    if (!isFirstPage) {
      setHoldOrganic(false)

      return
    }

    if (!isAdsLoading) {
      setHoldOrganic(false)

      return
    }

    setHoldOrganic(true)

    const ADS_WAIT_MS = 2000
    const timeoutId = setTimeout(() => {
      setHoldOrganic(false)
    }, ADS_WAIT_MS)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [isAdsLoading, isFirstPage])

  const mergedProps = useMemo(() => {
    const newProps = { ...props }

    // While ads are loading (and within wait window), hide organic products to avoid flicker
    if (isFirstPage && holdOrganic && newProps.searchQuery) {
      newProps.searchQuery = {
        ...newProps.searchQuery,
        loading: true,
        data: {
          ...newProps.searchQuery.data,
          products: [],
          productSearch: {
            ...newProps.searchQuery.data.productSearch,
            products: [],
          },
        },
        products: [],
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
            ...newProps.searchQuery.data.productSearch,
            products: mergedProducts,
          },
        },
        products: mergedProducts,
      }
    }

    return newProps
  }, [props, sponsoredSearchResult, holdOrganic, isFirstPage])

  return mergedProps
}

export default useMergeResults
