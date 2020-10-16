import React, { useMemo, useCallback, memo } from 'react'

import { ExtensionPoint } from 'vtex.render-runtime'
import { usePixel } from 'vtex.pixel-manager/PixelContext'
import ProductSummary from 'vtex.product-summary/ProductSummaryCustom'
import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'
import { ExperimentalLazyImages as LazyImages } from 'vtex.render-runtime'

import { productShape } from '../constants/propTypes'
import { PropTypes } from 'prop-types'

/**
 * Normalizes the item received in the props to adapt to the extension point prop.
 */
const GalleryItem = ({ item, displayMode, summary, preload }) => {
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
    <LazyImages lazyLoad={!preload}>
      <ExtensionPoint
        id="product-summary"
        {...summary}
        product={product}
        displayMode={displayMode}
        actionOnClick={handleClick}
        preload={preload}
      />
    </LazyImages>
  )
}

GalleryItem.propTypes = {
  /** Item info that will be rendered. */
  item: productShape,
  /** ProductSummary props. */
  summary: PropTypes.any,
  /** Display mode of the product summary */
  displayMode: PropTypes.string,
  preload: PropTypes.bool,
}

export default memo(GalleryItem)
