import React from 'react'
import { PropTypes } from 'prop-types'
import classNames from 'classnames'

import { productShape } from '../constants/propTypes'
import GalleryItem from './GalleryItem'

/**
 * Canonical gallery that displays a list of given products.
 */
const Gallery = props => {
  const { maxItemsPerLine, products, summary } = props

  const className = classNames('vtex-gallery pa3 w-100', {
    'vtex-gallery--max-5': maxItemsPerLine === 5,
    'vtex-gallery--max-4': maxItemsPerLine === 4,
    'vtex-gallery--max-3': maxItemsPerLine === 3,
  })

  return (
    <div className={className}>
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
  /** Maximum number of items per line. */
  maxItemsPerLine: PropTypes.number.isRequired,
  /** Maximum number of items per page. */
  maxItemsPerPage: PropTypes.number.isRequired,
  /** Products to be displayed. */
  products: PropTypes.arrayOf(productShape),
  /** ProductSummary props. */
  summary: PropTypes.any,
}

Gallery.defaultProps = {
  maxItemsPerLine: 5,
  maxItemsPerPage: 10,
  products: [],
}

export default Gallery
