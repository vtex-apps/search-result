import React, { useMemo, useCallback, memo } from 'react'
import { ExtensionPoint } from 'vtex.render-runtime'
import { usePixel } from 'vtex.pixel-manager/PixelContext'

import { productShape } from '../constants/propTypes'
import { PropTypes } from 'prop-types'
import { normalizeProduct } from '../constants/productHelpers'

/**
 * Normalizes the item received in the props to adapt to the extension point prop.
 */
const GalleryItem = ({ item, displayMode, summary }) => {
  const { push } = usePixel()

  const product = useMemo(() => normalizeProduct(item), [item])

  const handleClick = useCallback(
    () => push({ event: 'productClick', product }),
    [product, push]
  )

  return (
    <ExtensionPoint
      id="product-summary"
      {...summary}
      product={product}
      displayMode={displayMode}
      actionOnClick={handleClick}
    />
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
