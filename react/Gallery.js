import React from 'react'
import classNames from 'classnames'
import { List, WindowScroller, AutoSizer, CellMeasurer, CellMeasurerCache } from "react-virtualized"
import { PropTypes } from 'prop-types'

import { withRuntimeContext, NoSSR } from 'render'

import { productShape } from './constants/propTypes'
import GalleryItem from './components/GalleryItem'

/**
 * Canonical gallery that displays a list of given products.
 */

const Gallery = ({
  products,
  summary,
  layoutMode,
  runtime: { hints: { mobile } },
  itemWidth }) => {

  const cache = new CellMeasurerCache({
    defaultHeight: 305,
    fixedWidth: true,
    keyMapper: () => 1
  })

  const renderRow = ({ index, key, style, parent }, itemsPerRow) => {
    const from = index * itemsPerRow
    const rowItems = products.slice(from, from + itemsPerRow)

    const containerClasses = classNames('Row vtex-gallery__row', {
      'vtex-gallery__row--two-columns': layoutMode === 'small' && mobile,
    })

    return (
      <CellMeasurer
        cache={cache}
        columnIndex={0}
        key={key}
        parent={parent}
        rowIndex={index}>
        {({ measure }) => {
          return <div className={containerClasses} key={key} style={style} onLoad={measure}>
            {rowItems.map(item =>
              <div
                key={item.productId}
                className="vtex-gallery__item mv2 pa1">
                <GalleryItem
                  item={item}
                  summary={summary}
                  displayMode={layoutMode}
                />
              </div>
            )}
          </div>
        }}
      </CellMeasurer>
    )
  }

  const renderOnServer = () => {
    return products.map(item => (
      <div
        key={item.productId}
        className="vtex-gallery__item mv2 pa1">
        <GalleryItem
          item={item}
          summary={summary}
          displayMode={layoutMode}
        />
      </div>
    ))
  }

  const galleryClass = classNames('vtex-gallery pa3 bn', {
    'vtex-gallery--two-columns': layoutMode === 'small'
  })

  return (
    <div className={galleryClass}>
      <NoSSR onSSR={renderOnServer()}>
        <WindowScroller>
          {({ height }) => {
            return (
              <AutoSizer disableHeight>
                {({ width }) => {
                  const itemsPerRow = (layoutMode === 'small' && mobile) ? 2 : (Math.floor(width / itemWidth) || 1)
                  const nRows = Math.ceil(products.length / itemsPerRow)

                  return <List
                    key={layoutMode}
                    deferredMeasurementCache={cache}
                    autoHeight
                    width={width}
                    height={height}
                    rowCount={nRows}
                    rowHeight={cache.rowHeight}
                    rowRenderer={args => renderRow(args, itemsPerRow)}
                  />
                }}
              </AutoSizer>
            )
          }}
        </WindowScroller>
      </NoSSR>
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
  itemWidth: PropTypes.number
}

Gallery.defaultProps = {
  maxItemsPerPage: 10,
  products: [],
  itemWidth: 300
}

export default withRuntimeContext(Gallery)
