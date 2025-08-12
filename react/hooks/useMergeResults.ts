import { useMemo } from 'react'
import type { UseAdsReturn } from '@vtex/ads-react'
import type SearchProductV3 from 'vtex.store-resources/QueryProductSearchV3'

import { mergeWithSponsoredProducts } from '../utils/adsUtils'

interface UseMergeResultsProps {
  productSearchResult: SearchProductV3
  sponsoredSearchResult: UseAdsReturn<SearchProductV3>
  from?: number
}

const useMergeResults = ({
  productSearchResult,
  sponsoredSearchResult,
  from,
}: UseMergeResultsProps) => {
  const merged = useMemo(
    () =>
      mergeWithSponsoredProducts(
        productSearchResult,
        sponsoredSearchResult,
        from
      ),
    [productSearchResult, sponsoredSearchResult, from]
  )

  return merged
}

export default useMergeResults
