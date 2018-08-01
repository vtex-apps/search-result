import React from 'react'
import { PropTypes } from 'prop-types'

import { productShape } from '../constants/propTypes'
import GalleryItem from './GalleryItem'

/**
 * Canonical gallery that displays a list of given products.
 */
const Gallery = props => {
  const { products, summary } = props

  return (
    <div className="vtex-gallery pa3">
      {products.map(item => {
        return (
          <div
            key={item.productId}
            className="vtex-gallery__item mv2 pa1"
          >
            <GalleryItem item={item} summary={summary} />
          </div>
        )
      })}
    </div>
  )
}

Gallery.propTypes = {
  /** Maximum number of items per page. */
  maxItemsPerPage: PropTypes.number.isRequired,
  /** Products to be displayed. */
  products: PropTypes.arrayOf(productShape),
  /** ProductSummary props. */
  summary: PropTypes.any,
}

Gallery.defaultProps = {
  maxItemsPerPage: 10,
  products: [],
}

export default Gallery
