import React from 'react'
import PropTypes from 'prop-types'

import { ExtensionPoint } from 'render'

/**
 * Normalizes the item received in the props to adapt to the extension point prop.
 */
class GalleryItem extends React.Component {
  normalizeProductSummary(product) {
    return {
      listPrice: product.items[0].sellers[0].commertialOffer.ListPrice,
      sellingPrice: product.items[0].sellers[0].commertialOffer.Price,
      imageUrl: product.items[0].images[0].imageUrl.replace('http:', ''),
      imageTag: product.items[0].images[0].imageTag,
      url: product.link,
      name: product.productName,
      skuName: product.items[0].name,
      brandName: product.brand,
      referenceCode:
        product.items[0].referenceId && product.items[0].referenceId[0].Value,
    }
  }

  render() {
    const { item } = this.props

    return (
      <ExtensionPoint
        id="product-summary"
        product={this.normalizeProductSummary(item)}
      />
    )
  }
}

GalleryItem.propTypes = {
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

export default GalleryItem
