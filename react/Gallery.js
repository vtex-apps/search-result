import React from 'react'
import { PropTypes } from 'prop-types'
import classNames from 'classnames'

import { productShape } from './constants/propTypes'
import GalleryItem from './components/GalleryItem'

/**
 * Canonical gallery that displays a list of given products.
 */
const Gallery = ({ products, summary, layoutMode }) => {
  const classes = classNames('vtex-gallery pa3 bn-ns bt-s b--muted-4', {
    'vtex-gallery--two-columns': layoutMode === 'small',
  })

  return (
    <div className={classes}>
      {products.map(item => {
        return (
          <div
            key={item.productId}
            className="vtex-gallery__item mv2 pa1"
          >
            <GalleryItem
              item={item}
              summary={summary}
              displayMode={layoutMode}
            />
          </div>
        )
      })}
    </div>
  )
}

Gallery.propTypes = {
  /** Products to be displayed. */
  products: PropTypes.arrayOf(productShape),
  /** ProductSummary props. */
  summary: PropTypes.any,
  /** Layout mode of the gallery */
  layoutMode: PropTypes.string,
}

Gallery.defaultProps = {
  maxItemsPerPage: 10,
  products: [],
}

export default Gallery
