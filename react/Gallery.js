import classNames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeGrid as Grid } from 'react-window'
import { pluck } from 'ramda'

import { useRuntime } from 'vtex.render-runtime'

import { LAYOUT_MODE } from './components/LayoutModeSwitcher'
import { productShape } from './constants/propTypes'
import GalleryItem from './components/GalleryItem'

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
  summary,
}) => {
  const {
    hints: { mobile },
  } = useRuntime()

  const displayMode = mobile ? mobileLayoutMode : 'normal'

  const getItemsPerRow = width => {
    if (mobile) {
      return TWO_COLUMN_ITEMS
    }

    const maxItems = Math.floor(width / minItemWidth)
    return maxItemsPerRow <= maxItems ? maxItemsPerRow : maxItems
  }

  const galleryClasses = classNames(searchResult.gallery, 'bn ph1 pl9-l h-100')

  return (
    <div className={galleryClasses}>
      <AutoSizer>
        {({ height, width }) => {
          const columnCount = getItemsPerRow(width)
          const rowCount = Math.ceil(columnCount / products.length)

          return (
            <Grid
              height={height}
              width={width}
              itemData={{ columnCount, products, summary, displayMode }}
              columnWidth={minItemWidth}
              columnCount={columnCount}
              rowCount={rowCount}
              rowHeight={502}
            >
              {GalleryItem}
            </Grid>
          )
        }}
      </AutoSizer>
    </div>
  )
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

export default Gallery
