import React, { useMemo, useCallback, memo, ComponentType } from 'react'

import ProductSummary from 'vtex.product-summary/ProductSummaryCustom'
import { usePixel } from 'vtex.pixel-manager'
import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'
import type { Product } from '../Gallery'

interface GalleryLayoutItemProps {
  GalleryItemComponent: ComponentType<any>
  item: Product
  displayMode: string
  summary: unknown
  position: number
}

const GalleryLayoutItem: React.FC<GalleryLayoutItemProps> = ({
  GalleryItemComponent,
  item,
  displayMode,
  summary,
  position,
}) => {
  const { push } = usePixel()
  const { searchQuery } = useSearchPage()

  const product = useMemo(
    () => ProductSummary.mapCatalogProductToProductSummary(item),
    [item]
  )

  const query = useMemo(() => {
    if (searchQuery?.variables) {
      return searchQuery.variables.query
    }
  }, [searchQuery])

  const map = useMemo(() => searchQuery?.variables?.map, [
    searchQuery?.variables?.map,
  ])

  const handleClick = useCallback(() => {
    push({ event: 'productClick', product, query, map, position })
  }, [product, query, push])

  return (
    <GalleryItemComponent
      {...summary}
      product={product}
      displayMode={displayMode}
      actionOnClick={handleClick}
    />
  )
}

export default memo(GalleryLayoutItem)
