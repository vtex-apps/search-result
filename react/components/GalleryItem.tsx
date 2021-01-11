import React, { useMemo, useCallback, memo, ComponentType } from 'react'

import { ExtensionPoint } from 'vtex.render-runtime'
import { usePixel } from 'vtex.pixel-manager'
import ProductSummary from 'vtex.product-summary/ProductSummaryCustom'
import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'

import { Product } from '../Gallery'
import { MobileLayoutMode } from '../GalleryLegacy'

interface GalleryItemProps {
  /** Item info that will be rendered. */
  item: Product
  /** Display mode of the product summary */
  displayMode: MobileLayoutMode
  /** ProductSummary props. */
  summary: any
  CustomSummary?: ComponentType
}

/**
 * Normalizes the item received in the props to adapt to the extension point prop.
 */
function GalleryItem({
  item,
  displayMode,
  summary,
  CustomSummary,
}: GalleryItemProps) {
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

  if (CustomSummary) {
    return <CustomSummary {...productSummaryProps} />
  }

  return <ExtensionPoint id="product-summary" {...productSummaryProps} />
}

export default memo(GalleryItem)
