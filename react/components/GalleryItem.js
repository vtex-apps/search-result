import React, { Component } from 'react'
import { ExtensionPoint } from 'vtex.render-runtime'
import { path, sort, useWith, subtract, multiply, compose } from 'ramda'

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

    const getAvailableQuantity =  path(['sellers', '0', 'commertialOffer', 'AvailableQuantity'])

    const compareAvailableQuantity = compose(multiply(-1), useWith(subtract, [getAvailableQuantity, getAvailableQuantity]))
    
    const normalizedProduct = { ...product }

    const [sku] = sort(compareAvailableQuantity, normalizedProduct.items) || []

    if (sku) {
      const [seller = { commertialOffer: { Price: 0, ListPrice: 0 } }] = sku.sellers || []
      const [referenceId = { Value: '' }] = sku.referenceId || []
      const [image = { imageUrl: '' }] = sku.images || []
      const unmixedImage = { ...image, imageUrl: image.imageUrl.replace(/^https?:/, '') }
      normalizedProduct.sku = { ...sku, seller, referenceId, image: unmixedImage }
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
