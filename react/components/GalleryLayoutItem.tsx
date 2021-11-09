import type { ComponentType } from 'react'
import React, { useMemo, useCallback, memo } from 'react'
import ProductSummary from 'vtex.product-summary/ProductSummaryCustom'
import { usePixel } from 'vtex.pixel-manager'
import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'

import type { Product } from '../Gallery'
import type { PreferredSKU } from '../GalleryLayout'

interface GalleryLayoutItemProps {
  GalleryItemComponent: ComponentType<any>
  item: Product
  displayMode: string
  summary: unknown
  position: number
  listName: string
  /** Logic to enable which SKU will be the selected item */
  preferredSKU?: PreferredSKU
}

const GalleryLayoutItem: React.FC<GalleryLayoutItemProps> = ({
  GalleryItemComponent,
  item,
  displayMode,
  summary,
  position,
  listName,
  preferredSKU,
}) => {
  const { push } = usePixel()
  const { searchQuery } = useSearchPage()

  const product = useMemo(
    () => ProductSummary.mapCatalogProductToProductSummary(item, preferredSKU),
    [item, preferredSKU]
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

  return (
    <GalleryItemComponent
      {...summary}
      product={product}
      displayMode={displayMode}
      actionOnClick={handleClick}
      listName={listName}
      position={position}
    />
  )
}

export default memo(GalleryLayoutItem)
