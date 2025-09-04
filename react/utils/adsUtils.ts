// Use types from @vtex/ads-react where available
import type { useAds } from '@vtex/ads-react'

type SponsoredResult = ReturnType<typeof useAds>

export const mergeWithSponsoredProducts = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  productSearchResult: any,
  sponsoredSearchResult: SponsoredResult,
  from?: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): unknown => {
  const isFirstPage = from === 0

  if (!isFirstPage) return productSearchResult

  const originalProducts =
    productSearchResult?.data?.productSearch?.products ?? []

  const sponsoredProducts = sponsoredSearchResult.ads
    .map(p => p.product ?? p)
    .filter(Boolean) as any[]

  if (!sponsoredProducts?.length) return productSearchResult

  const sponsoredIds = new Set(
    (sponsoredProducts.map(p => p.id).filter(Boolean) as string[]) ?? []
  )

  const filteredOriginalProducts = originalProducts.filter(
    (p: { id: string }) => !sponsoredIds.has(p.id)
  )

  const combinedProducts = [...sponsoredProducts, ...filteredOriginalProducts]

  return {
    ...productSearchResult,
    data: {
      ...(productSearchResult?.data ?? {}),
      productSearch: {
        ...(productSearchResult?.data?.productSearch ?? {}),
        products: combinedProducts,
      },
    },
  }
}
