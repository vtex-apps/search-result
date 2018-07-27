import React from 'react'
import { PropTypes } from 'prop-types'
import classNames from 'classnames'

import { productShape } from '../constants/propTypes'
import GalleryItem from './GalleryItem'

/**
 * Canonical gallery that displays a list of given products.
 */
const Gallery = props => {
  const { maxItemsPerLine } = props

  const itemClassName = classNames('vtex-gallery__item flex mv2 pa1 fl', {
    'w-100 w-50-m w-20-l': maxItemsPerLine === 5,
    'w-100 w-50-m w-25-l': maxItemsPerLine === 4,
    'w-100 w-50-m w-third-l': maxItemsPerLine === 3,
  })

  return (
    <div className="vtex-gallery pa3 w-100 flex flex-wrap justify-start">
      {this.props.products.map(item => {
        return (
          <div
            key={item.productId}
            className={itemClassName}
          >
            <GalleryItem item={item} summary={props.summary} />
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
