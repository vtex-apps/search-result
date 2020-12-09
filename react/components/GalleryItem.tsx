import React, { useMemo, useCallback, memo, ComponentType } from 'react'

import { ExtensionPoint } from 'vtex.render-runtime'
import { usePixel } from 'vtex.pixel-manager/PixelContext'
import ProductSummary from 'vtex.product-summary/ProductSummaryCustom'
import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'

import { Product } from '../Gallery'
import { MobileLayoutMode } from '../GalleryLegacy'

interface GalleryItemProps {
  item: Product
  displayMode: MobileLayoutMode
  shouldRenderCustom?: boolean
  CustomSummary?: ComponentType
  /**
   * Apparently this is a dead prop and should as I could not find any scenario where the runtime passes it down or
   * even a case where product summary uses it. Therefore I will leave it as :any
   */
  summary: any
}

/**
 * Normalizes the item received in the props to adapt to the extension point prop.
 */
const GalleryItem: React.FC<GalleryItemProps> = ({
  item,
  displayMode,
  summary,
  shouldRenderCustom,
  CustomSummary,
}) => {
  const { push } = usePixel()
  const { searchQuery } = useSearchPage()

  const product = useMemo(
    () => ProductSummary.mapCatalogProductToProductSummary(item),
    [item]
  )

  const query = useMemo(() => {
    if (searchQuery && searchQuery.variables) {
      return searchQuery.variables.query
    }
  }, [searchQuery])

  const handleClick = useCallback(() => {
    push({ event: 'productClick', product, query })
  }, [product, query, push])

  const productSummaryProps = {
    ...summary,
    product,
    displayMode,
    actionOnClick: handleClick,
  }

  if (shouldRenderCustom && CustomSummary)
    return <CustomSummary {...productSummaryProps} />

  return <ExtensionPoint id="product-summary" {...productSummaryProps} />
}

export default memo(GalleryItem)
