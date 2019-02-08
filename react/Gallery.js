import React, { Component } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { withResizeDetector } from 'react-resize-detector'
import { map, compose } from 'ramda'

import { withRuntimeContext } from 'vtex.render-runtime'

import { productShape } from './constants/propTypes'
import GalleryItem from './components/GalleryItem'

import searchResult from './searchResult.css'

/**
 * Canonical gallery that displays a list of given products.
 */

const TWO_ITEMS = 2
const ONE_ITEM = 1

class Gallery extends Component {
  constructor(props) {
    super(props)
    this.state = { prevLayoutMode: this.props.layoutMode }
  }

  renderItem = item => {
    const { summary, layoutMode, gap, runtime: { hints: { mobile } } } = this.props
    const itemsPerRow = (layoutMode === 'small' && mobile) ? TWO_ITEMS : (this.itemsPerRow || ONE_ITEM)
    
    const style = {
      flexBasis: `calc(${100/itemsPerRow}% - ${gap}px)`,
      maxWidth: `calc(${100/itemsPerRow}% - ${gap}px)`,
      marginLeft: gap/2,
      marginRight: gap/2,
    }

    return (
      <div
        key={item.productId}
        style={style}
        className={searchResult.galleryItem}
      >
        <GalleryItem
          item={item}
          summary={summary}
          displayMode={layoutMode}
        />
      </div>
    )
  }

  get itemsPerRow() {
    const { maxItemsPerRow, gap, minItemWidth, width } = this.props
    const maxItems = Math.floor(width/(minItemWidth + gap))
    return maxItemsPerRow <= maxItems ? maxItemsPerRow : maxItems
  }
  
  render() {
    const {
      products,
      runtime: { hints: { mobile } },
    } = this.props

    const galleryClasses = classNames(searchResult.gallery, 'flex flex-row flex-wrap items-center content-stretch pa3 bn',{
      'mh4': !mobile,
    })

    return (
      <div className={galleryClasses}>
        {map(this.renderItem, products)}
      </div >
    )
  }
}

Gallery.propTypes = {
  /** Products to be displayed. */
  products: PropTypes.arrayOf(productShape),
  /** ProductSummary props. */
  summary: PropTypes.any,
  /** Gap in Px between items */
  gap: PropTypes.number,
  /** Max Items per Row */
  maxItemsPerRow: PropTypes.number,
  /** Layout mode of the gallery */
  layoutMode: PropTypes.string,
  /** Min Item Width. */
  minItemWidth: PropTypes.number,
  /** Render runtime mobile hint */
  runtime: PropTypes.shape({
    hints: PropTypes.shape({
      mobile: PropTypes.bool.isRequired,
    }).isRequired,
  }).isRequired,
}

Gallery.defaultProps = {
  maxItemsPerPage: 10,
  products: [],
  gap: 16,
  maxItemsPerRow: 5,
  minItemWidth: 230,
}

export default compose(withResizeDetector, withRuntimeContext)(Gallery)