import React, { Component } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { withResizeDetector } from 'react-resize-detector'
import { map, compose, pluck } from 'ramda'

import { withRuntimeContext } from 'vtex.render-runtime'

import { LAYOUT_MODE } from './components/LayoutModeSwitcher'
import { productShape } from './constants/propTypes'
import GalleryItem from './components/GalleryItem'

import searchResult from './searchResult.css'
import { getGapPaddingValues } from './constants/paddingEnum'

/** Layout with two column */
const TWO_COLUMN_ITEMS = 2

/**
 * Canonical gallery that displays a list of given products.
 */
class Gallery extends Component {
  get layoutMode() {
    const {
      mobileLayoutMode,
      runtime: { hints: { mobile } },
    } = this.props

    return mobile ? mobileLayoutMode : 'normal'
  }  

  get itemsPerRow() {
    const { maxItemsPerRow, minItemWidth, width } = this.props
    const maxItems = Math.floor(width / (minItemWidth))
    return maxItemsPerRow <= maxItems ? maxItemsPerRow : maxItems
  }

  renderItem = item => {
    const { summary, layoutMode, gap, runtime: { hints: { mobile } }, maxItemsPerRow } = this.props
    const itemsPerRow = (layoutMode === 'small' && mobile) ? TWO_COLUMN_ITEMS : (this.itemsPerRow || maxItemsPerRow)
    console.log(getGapPaddingValues())

    const style = {
      flexBasis: `${100 / itemsPerRow}%`,
      maxWidth: `${100 / itemsPerRow}%`,
    }

    return (
      <div
        key={item.productId}
        style={style}
        className={classNames(searchResult.galleryItem, gap)}
      >
        <GalleryItem
          item={item}
          summary={summary}
          displayMode={this.layoutMode}
        />
      </div>
    )
  }

  get itemsPerRow() {
    const { maxItemsPerRow, minItemWidth, width } = this.props
    const maxItems = Math.floor(width / (minItemWidth))
    return maxItemsPerRow <= maxItems ? maxItemsPerRow : maxItems
  }

  render() {
    const {
      products,
      runtime: { hints: { mobile } },
    } = this.props

    const galleryClasses = classNames(searchResult.gallery, 'flex flex-row flex-wrap items-stretch pa3 bn', {
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
  /** Container width */
  width: PropTypes.number,
  /** Products to be displayed. */
  products: PropTypes.arrayOf(productShape),
  /** ProductSummary props. */
  summary: PropTypes.any,
  /** Gap between items */
  gap: PropTypes.oneOf(getGapPaddingValues()),
  /** Max Items per Row */
  maxItemsPerRow: PropTypes.number,
  /** Layout mode of the gallery in mobile view */
  mobileLayoutMode: PropTypes.oneOf(pluck('value', LAYOUT_MODE)),
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
  products: [],
  maxItemsPerRow: 5,
  minItemWidth: 240,
  mobileLayoutMode: LAYOUT_MODE[0].value,
}

export default compose(withResizeDetector, withRuntimeContext)(Gallery)
