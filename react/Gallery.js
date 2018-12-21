import React from 'react'
import classNames from 'classnames'
import { List, WindowScroller, AutoSizer, CellMeasurer, CellMeasurerCache } from 'react-virtualized'
import PropTypes from 'prop-types'
import { Adopt } from 'react-adopt'

import { withRuntimeContext, NoSSR } from 'render'

import { productShape } from './constants/propTypes'
import GalleryItem from './components/GalleryItem'

/**
 * Canonical gallery that displays a list of given products.
 */

const TWO_ITEMS = 2
const ONE_ITEM = 1

/**
 *  Cache to measure the rows height
 * */
const cache = new CellMeasurerCache({
  fixedWidth: true,
  keyMapper: () => 1,
})

const Gallery = ({
  products,
  summary,
  layoutMode,
  runtime: { hints: { mobile } },
  itemWidth,
}) => {

  cache.clearAll()

  const renderItem = (item) => (
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

  const renderRow = ({ index, key, style, parent, itemsPerRow }) => {
    const from = index * itemsPerRow
    const rowItems = products.slice(from, from + itemsPerRow)

    const containerClasses = classNames('vtex-gallery__row', {
      'vtex-gallery--two-columns': layoutMode === 'small' && mobile,
    })

    return (
      <CellMeasurer
        cache={cache}
        columnIndex={0}
        key={key}
        parent={parent}
        rowIndex={index}
      >
        {({ measure }) => (
          <div className={containerClasses} key={key} style={style} onLoad={measure}>
            {rowItems.map(renderItem)}
          </div>
        )}
      </CellMeasurer>
    )
  }

  const ssrContainer = classNames('vtex-gallery pa3 bn', {
    'vtex-gallery--two-columns': layoutMode == 'small' && mobile
  })

  const ssrFallBack = (
    <div className={ssrContainer}>
      {products.map(renderItem)}
    </div>
  )

  return (
    <NoSSR onSSR={ssrFallBack}>
      <div className="vtex-gallery pa3 bn">
        <Adopt
          key={layoutMode}
          mapper={{
            scroller: <WindowScroller />,
            autoSizer: <AutoSizer disableHeight />,
          }}
          mapProps={({ scroller: { height }, autoSizer: { width } }) => ({ width, height })}
        >
          {({ width, height }) => {
            const itemsPerRow = (layoutMode === 'small' && mobile) ? TWO_ITEMS : (Math.floor(width / itemWidth) || ONE_ITEM)
            const nRows = Math.ceil(products.length / itemsPerRow)

            return (
              <List
                key={layoutMode}
                deferredMeasurementCache={cache}
                autoHeight
                width={width}
                height={height}
                rowCount={nRows}
                rowHeight={cache.rowHeight}
                rowRenderer={args => renderRow({ ...args, itemsPerRow })}
              />
            )
          }}
        </Adopt>
      </div >
    </NoSSR>
  )
}

Gallery.propTypes = {
  /** Products to be displayed. */
  products: PropTypes.arrayOf(productShape),
  /** ProductSummary props. */
  summary: PropTypes.any,
  /** Layout mode of the gallery */
  layoutMode: PropTypes.string,
  /** Item Width. */
  itemWidth: PropTypes.number,
}

Gallery.defaultProps = {
  maxItemsPerPage: 10,
  products: [],
  itemWidth: 300,
}

export default withRuntimeContext(Gallery)
