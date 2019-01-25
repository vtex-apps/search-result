import React, { Component } from 'react'
import { ExtensionPoint } from 'vtex.render-runtime'
import { path, compose } from 'ramda'

import { productShape } from '../constants/propTypes'
import { PropTypes } from 'prop-types'

/**
 * Normalizes the item received in the props to adapt to the extension point prop.
 */
export default class GalleryItem extends Component {
  static propTypes = {
    /** Item info that will be rendered. */
    item: productShape,
    /** ProductSummary props. */
    summary: PropTypes.any,
    /** Display mode of the product summary */
    displayMode: PropTypes.string,
  }

  normalizeProductSummary(product) {
    if (!product) {
      return null
    }

    const normalizedProduct = { ...product }
    const [sku] = normalizedProduct.items || []

    const sum = array => array.reduce((x, y) => x + y)

    const transform = array => array.map(item => {
      const [seller] = item.sellers
      return path(['commertialOffer', 'AvailableQuantity'], seller)
    })
    
    const skusAvailable = compose(sum, transform)(normalizedProduct.items)

    if (sku) {
      const [seller = { commertialOffer: { Price: 0, ListPrice: 0 } }] = sku.sellers || []
      const [referenceId = { Value: '' }] = sku.referenceId || []
      const [image = { imageUrl: '' }] = sku.images || []
      const unmixedImage = { ...image, imageUrl: image.imageUrl.replace(/^https?:/, '') }
      normalizedProduct.sku = { ...sku, seller, referenceId, image: unmixedImage }
      seller.commertialOffer.AvailableQuantity = skusAvailable
    }

    return normalizedProduct
  }

  render() {
    return (
      <ExtensionPoint
        id="product-summary"
        {...this.props.summary}
        product={this.normalizeProductSummary(this.props.item)}
        displayMode={this.props.displayMode}
      />
    )
  }
}
