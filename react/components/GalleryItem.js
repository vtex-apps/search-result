import classNames from 'classnames'
import { PropTypes } from 'prop-types'
import React from 'react'
import { ExtensionPoint } from 'vtex.render-runtime'
import { path, sort, comparator, useWith, gt } from 'ramda'

import { productShape } from '../constants/propTypes'
import { changeImageUrlSize, toHttps } from '../constants/urlHelpers'
import styles from '../searchResult.css'

/**
 * Normalizes the item received in the props to adapt to the extension point prop.
 */
const GalleryItem = ({ style, data, columnIndex, rowIndex }) => {
  const item = data.products[rowIndex * data.columnCount + columnIndex]
  const summary = data.summary
  const displayMode = data.displayMode

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

  return (
    <div style={style} className={classNames(styles.galleryItem, 'pa4')}>
      <ExtensionPoint
        id="product-summary"
        {...summary}
        product={normalizeProductSummary(item)}
        displayMode={displayMode}
      />
    </div>
  )
}

GalleryItem.propTypes = {
  /** Item data */
  data: PropTypes.shape({
    products: productShape,
  }),
  /** Item column index on grid */
  columnIndex: PropTypes.number,
  /** Item row index on grid */
  rowIndex: PropTypes.number,
  /** Style from react-window */
  style: PropTypes.object,
}

export default GalleryItem
