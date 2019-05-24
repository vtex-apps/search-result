import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { map, pluck, addIndex } from 'ramda'

import { useRuntime } from 'vtex.render-runtime'

import { LAYOUT_MODE } from './components/LayoutModeSwitcher'
import { productShape } from './constants/propTypes'
import GalleryItem from './components/GalleryItem'
import withResizeDetector from './components/withResizeDetector'

import searchResult from './searchResult.css'

/** Layout with two column */
const TWO_COLUMN_ITEMS = 2

/**
 * Canonical gallery that displays a list of given products.
 */
const Gallery = ({
  products = [],
  mobileLayoutMode = LAYOUT_MODE[0].value,
  maxItemsPerRow = 5,
  minItemWidth = 240,
  width,
  summary,
  showingFacets,
}) => {
  const runtime = useRuntime()

  const layoutMode = runtime.hints.mobile ? mobileLayoutMode : 'normal'

  const getItemsPerRow = () => {
    const maxItems = Math.floor(width / minItemWidth)
    return maxItemsPerRow <= maxItems ? maxItemsPerRow : maxItems
  }

  const renderItem = (item, index) => {
    const itemsPerRow =
      layoutMode === 'small'
        ? TWO_COLUMN_ITEMS
        : getItemsPerRow() || maxItemsPerRow

    const style = {
      flexBasis: `${100 / itemsPerRow}%`,
      maxWidth: `${100 / itemsPerRow}%`,
    }

    return (
      <div
        key={item.productId}
        style={style}
        className={classNames(searchResult.galleryItem, 'pa4')}
      >
        <GalleryItem item={item} summary={summary} positionList={index + 1} displayMode={layoutMode} />
      </div>
    )
  }

  const galleryClasses = classNames(
    searchResult.gallery,
    'flex flex-row flex-wrap items-stretch bn ph1 na4', {
      'justify-center': !showingFacets,
      'pl9-l': showingFacets,
    })

  const mapWithIndex = addIndex(map)

  return <div className={galleryClasses}>{mapWithIndex(renderItem, products)}</div>
}

Gallery.propTypes = {
  /** Container width */
  width: PropTypes.number,
  /** Products to be displayed. */
  products: PropTypes.arrayOf(productShape),
  /** ProductSummary props. */
  summary: PropTypes.any,
  /** Max Items per Row */
  maxItemsPerRow: PropTypes.number,
  /** Layout mode of the gallery in mobile view */
  mobileLayoutMode: PropTypes.oneOf(pluck('value', LAYOUT_MODE)),
  /** Min Item Width. */
  minItemWidth: PropTypes.number,
}

export default withResizeDetector(Gallery)
