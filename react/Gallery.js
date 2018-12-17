import React from 'react'
import classNames from 'classnames'
import { List, WindowScroller, AutoSizer } from "react-virtualized"
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
  itemDimensions: { height: itemHeights },
  itemDimensions: { width: itemWidths } }) => {

  const renderRow = ({ index, key, style }, itemsPerRow) => {
    const from = index * itemsPerRow
    const rowItems = products.slice(from, from + itemsPerRow)

    return (
      <div className="ml3-ns Row" key={key} style={style}>
        {rowItems.map(item =>
          <div
            key={item.productId}
            className="vtex-gallery__item mv2 mh3 pa1 dib-ns di-s">
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

  const itemHeight = itemHeights[layoutMode]
  const itemWidth = itemWidths[layoutMode]

  return (
    <div className="vtex-gallery pa1 bn">
      <NoSSR onSSR={renderOnServer()}>
        <WindowScroller>
          {({ height }) => {
            return (
              <AutoSizer disableHeight>
                {({ width }) => {
                  const itemsPerRow = layoutMode === 'small' ? 2 : (Math.floor(width / itemWidth) || 1)
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
}

Gallery.defaultProps = {
  maxItemsPerPage: 10,
  products: [],
  itemDimensions: {
    width: {
      inline: 300,
      normal: 300,
      small: 300,
    },
    height: {
      inline: 150,
      normal: 480,
      small: 500,
    }
  }
}

export default withRuntimeContext(Gallery)
