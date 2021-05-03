import type { ComponentType } from 'react'
import React, { useMemo, useCallback, memo } from 'react'
import { ExtensionPoint } from 'vtex.render-runtime'
import { usePixel } from 'vtex.pixel-manager'
import ProductSummary from 'vtex.product-summary/ProductSummaryCustom'
import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'

import type { Product } from '../Gallery'
import type { MobileLayoutMode } from '../GalleryLegacy'
import { useBreadcrumb } from '../hooks/useBreadcrumb'
import { useSearchTitle } from '../hooks/useSearchTitle'

interface GalleryItemProps {
  /** Item info that will be rendered. */
  item: Product
  /** Display mode of the product summary */
  displayMode: MobileLayoutMode
  /** ProductSummary props. */
  summary: any
  /** Item position in the gallery */
  position: number
  CustomSummary?: ComponentType
}

/**
 * Normalizes the item received in the props to adapt to the extension point prop.
 */
function GalleryItem({
  item,
  displayMode,
  position,
  summary,
  CustomSummary,
}: GalleryItemProps) {
  const { push } = usePixel()
  const { searchQuery } = useSearchPage()
  const breadcrumb = useBreadcrumb()
  const listName = useSearchTitle(breadcrumb ?? []).trim() || 'Search result'

  const product = useMemo(
    () => ProductSummary.mapCatalogProductToProductSummary(item),
    [item]
  )

  const handleClick = useCallback(() => {
    push({
      event: 'productClick',
      product,
      query: searchQuery?.variables?.query,
      map: searchQuery?.variables?.map,
      position,
      list: listName,
    })
  }, [
    product,
    push,
    searchQuery?.variables?.map,
    searchQuery?.variables?.query,
    position,
    listName,
  ])

  const productSummaryProps = {
    ...summary,
    product,
    displayMode,
    listName,
    actionOnClick: handleClick,
  }

  if (CustomSummary) {
    return <CustomSummary {...productSummaryProps} />
  }

  return <ExtensionPoint id="product-summary" {...productSummaryProps} />
}

export default memo(GalleryItem)
