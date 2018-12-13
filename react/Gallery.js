import React from 'react'
import classNames from 'classnames'
import { List, WindowScroller, AutoSizer } from "react-virtualized"
import { PropTypes } from 'prop-types'

import { productShape } from './constants/propTypes'
import GalleryItem from './components/GalleryItem'

/**
 * Canonical gallery that displays a list of given products.
 */

const Gallery = ({ products, summary, layoutMode, itemWidth, itemHeight }) => {
  const renderRow = ({ index, key, style }, itemsPerRow) => {
    const from = index * itemsPerRow
    const rowItems = products.slice(from, from + itemsPerRow)

    return (
      <div className="vtex-gallery__row Row" key={key} style={style}>
        {rowItems.map(item =>
          <div
            key={item.productId}
            className="vtex-gallery__item mv2 pa1 dib">
            <GalleryItem
              item={item}
              summary={summary}
              displayMode={layoutMode}
            />
          </div>
        )}
      </div>
    )
  }

  const classes = classNames('vtex-gallery pa3 bn', {
    'vtex-gallery--two-columns': layoutMode === 'small',
  })

  return (
    <div className={classes}>
      <WindowScroller>
        {({ height }) => {
          return (
            <AutoSizer disableHeight>
              {({ width }) => {
                const itemsPerRow = Math.floor(width / itemWidth) || 1
                const nRows = Math.ceil(products.length / itemsPerRow)
                return <List
                  autoHeight
                  width={width}
                  height={height}
                  rowCount={nRows}
                  rowHeight={itemHeight}
                  rowRenderer={args => renderRow(args, itemsPerRow)}
                />
              }}
            </AutoSizer>
          )
        }}
      </WindowScroller>
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
  /**TODO Add new props */
}

Gallery.defaultProps = {
  maxItemsPerPage: 10,
  products: [],
  itemWidth: 300,
  itemHeight: 500,
}

export default Gallery
