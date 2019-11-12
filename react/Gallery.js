import React, { useMemo } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { pluck, splitEvery } from 'ramda'

import { useDevice } from 'vtex.device-detector'
import { useResponsiveValue } from 'vtex.responsive-values'

import { LAYOUT_MODE } from './components/LayoutModeSwitcher'
import { productShape } from './constants/propTypes'
import withResizeDetector from './components/withResizeDetector'

import searchResult from './searchResult.css'
import GalleryRow from './components/GalleryRow'

/** Layout with one column */
const ONE_COLUMN_LAYOUT = 1

/**
 * Canonical gallery that displays a list of given products.
 */
const Gallery = ({
  products = [],
  mobileLayoutMode = 'normal',
  maxItemsPerRow = {
    desktop: 5,
    tablet: 3,
    phone: 2,
  },
  minItemWidth = 170,
  width,
  summary,
  showingFacets,
}) => {
  const { isMobile } = useDevice()
  const responsiveMaxItemsPerRow = useResponsiveValue(maxItemsPerRow)

  const layoutMode = isMobile ? mobileLayoutMode : 'normal'

  const getItemsPerRow = () => {
    const maxItems = Math.floor(width / minItemWidth)
    return responsiveMaxItemsPerRow <= maxItems
      ? responsiveMaxItemsPerRow
      : maxItems
  }

  const itemsPerRow =
    (layoutMode === 'small'
      ? getItemsPerRow()
      : isMobile
      ? ONE_COLUMN_LAYOUT
      : getItemsPerRow()) || responsiveMaxItemsPerRow

  const rows = useMemo(() => splitEvery(itemsPerRow, products), [
    itemsPerRow,
    products,
  ])

  const galleryClasses = classNames(
    searchResult.gallery,
    'flex flex-row flex-wrap items-stretch bn ph1 na4',
    {
      'justify-center': !showingFacets,
      'pl9-l': showingFacets,
    }
  )

  return (
    <div className={galleryClasses}>
      {rows.map((rowProducts, index) => (
        <GalleryRow
          key={index.toString()}
          widthAvailable={width != null}
          products={rowProducts}
          summary={summary}
          displayMode={layoutMode}
          rowIndex={index}
          itemsPerRow={itemsPerRow}
        />
      ))}
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
  showingFacets: PropTypes.bool,
}

export default withResizeDetector(Gallery)
