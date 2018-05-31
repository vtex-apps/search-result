import React, { Component } from 'react'
import PropTypes from 'prop-types'

import ProductSummary from 'vtex.product-summary/ProductSummary'

/**
 * Normalizes the item received in the props to adapt to the extension point prop.
 */
export default class GalleryItem extends Component {
  static propTypes = {
    /**
     * Item info that will be rendered.
     */
    item: PropTypes.shape({
      productId: PropTypes.string.isRequired,
      productName: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
      brand: PropTypes.string.isRequired,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          referenceId: PropTypes.arrayOf(
            PropTypes.shape({
              Value: PropTypes.string.isRequired,
            }),
          ),
          images: PropTypes.arrayOf(
            PropTypes.shape({
              imageUrl: PropTypes.string.isRequired,
              imageTag: PropTypes.string.isRequired,
            }),
          ).isRequired,
          sellers: PropTypes.arrayOf(
            PropTypes.shape({
              commertialOffer: PropTypes.shape({
                Price: PropTypes.number.isRequired,
                ListPrice: PropTypes.number.isRequired,
              }),
            }),
          ).isRequired,
        }),
      ).isRequired,
    }),
  }

  normalizeProductSummary(product) {
    if (!product) return null
    const newProduct = { ...product }
    if (newProduct.items && newProduct.items.length) {
      newProduct.sku = { ...newProduct.items[0] }
      if (newProduct.sku.sellers && newProduct.sku.sellers.length) {
        newProduct.sku.seller = newProduct.sku.sellers[0]
      } else {
        newProduct.sku.seller = {
          commertialOffer: {
            Price: 0,
            ListPrice: 0,
          },
        }
      }
      if (newProduct.sku.images && newProduct.sku.images.length) {
        newProduct.sku.image = { ...newProduct.sku.images[0] }
        newProduct.sku.image.imageUrl = newProduct.sku.image.imageUrl
          .replace('http:', '')
          .replace('https:', '')
      }
      newProduct.sku.referenceId = (newProduct.sku.referenceId &&
        newProduct.sku.referenceId[0]) || {
        Value: '',
      }
      delete newProduct.sku.sellers
      delete newProduct.sku.images
      delete newProduct.items
    }
    return newProduct
  }

  render() {
    return <ProductSummary product={this.normalizeProductSummary(this.props.item)} />
  }
}
