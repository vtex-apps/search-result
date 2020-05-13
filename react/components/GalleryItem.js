import React, { useMemo, useCallback, memo } from 'react'
import { ExtensionPoint } from 'vtex.render-runtime'
import { usePixel } from 'vtex.pixel-manager/PixelContext'
import ProductSummary from 'vtex.product-summary/ProductSummaryCustom'

import { productShape } from '../constants/propTypes'
import { PropTypes } from 'prop-types'

/**
 * Normalizes the item received in the props to adapt to the extension point prop.
 */
const GalleryItem = ({
  item,
  displayMode,
  summary,
  ProductSummary: ProductSummarySlot,
}) => {
  const { push } = usePixel()

  const product = useMemo(
    () => ProductSummary.mapCatalogProductToProductSummary(item),
    [item]
  )

  const handleClick = useCallback(
    () => push({ event: 'productClick', product }),
    [product, push]
  )

  return (
    <ProductSummarySlot
      {...summary}
      product={product}
      displayMode={displayMode}
      actionOnClick={handleClick}
    />
    // <ExtensionPoint
    //   id="product-summary"
    //   {...summary}
    //   product={product}
    //   displayMode={displayMode}
    //   actionOnClick={handleClick}
    // />
  )
}

GalleryItem.propTypes = {
  /** Item info that will be rendered. */
  item: productShape,
  /** ProductSummary props. */
  summary: PropTypes.any,
  /** Display mode of the product summary */
  displayMode: PropTypes.string,
}

export default memo(GalleryItem)
