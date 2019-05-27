import React, { useEffect, useMemo, useCallback } from 'react'
import { ExtensionPoint } from 'vtex.render-runtime'
import { usePixel } from 'vtex.pixel-manager/PixelContext'
import { path, sort, comparator, useWith, gt } from 'ramda'

import { productShape } from '../constants/propTypes'
import { changeImageUrlSize, toHttps } from '../constants/urlHelpers'
import { PropTypes } from 'prop-types'

const normalizeProductSummary = product => {
  if (!product) {
    return null
  }

  const getAvailableQuantity = path([
    'sellers',
    '0',
    'commertialOffer',
    'AvailableQuantity',
  ])

  const compareAvailableQuantity = comparator(
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useWith(gt, [getAvailableQuantity, getAvailableQuantity])
  )

  const normalizedProduct = { ...product }

  const [sku] = sort(compareAvailableQuantity, normalizedProduct.items) || []

  if (sku) {
    const [seller = { commertialOffer: { Price: 0, ListPrice: 0 } }] =
      sku.sellers || []
    const [referenceId = { Value: '' }] = sku.referenceId || []
    const [image = { imageUrl: '' }] = sku.images || []
    const resizedImage = changeImageUrlSize(toHttps(image.imageUrl), 500)
    const normalizedImage = { ...image, imageUrl: resizedImage }
    normalizedProduct.sku = {
      ...sku,
      seller,
      referenceId,
      image: normalizedImage,
    }
  }

  return normalizedProduct
}

/**
 * Normalizes the item received in the props to adapt to the extension point prop.
 */
const GalleryItem = ({ item, displayMode, summary, positionList }) => {
  const { push } = usePixel()

  const product = useMemo(() => normalizeProductSummary(item), [item])

  const handleClick = useCallback(
    () => push({ event: 'productClick', product }),
    [product, push]
  )

  useEffect(() => {
    push({
      event: 'productImpression',
      list: 'Search result',
      product,
      position: positionList,
    })
  }, [product, positionList, push])

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
  /** Item's position in the list in which it is rendered. */
  positionList: PropTypes.number,
}

export default GalleryItem
