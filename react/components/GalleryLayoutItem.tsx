import React, { useMemo, useCallback, memo } from 'react'

import ProductSummary from 'vtex.product-summary/ProductSummaryCustom'
import { usePixel } from 'vtex.pixel-manager'
import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'

const GalleryLayoutItem: React.FC<GalleryLayoutItemProps> = ({
  GalleryItemComponent,
  item,
  displayMode,
  summary,
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
