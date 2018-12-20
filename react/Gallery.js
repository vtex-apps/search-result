import React from 'react'
import classNames from 'classnames'
import { List, WindowScroller, AutoSizer, CellMeasurer, CellMeasurerCache } from 'react-virtualized'
import { PropTypes } from 'prop-types'
import { Adopt } from 'react-adopt'

import { withRuntimeContext, NoSSR } from 'render'

import { productShape } from './constants/propTypes'
import GalleryItem from './components/GalleryItem'

/**
 * Canonical gallery that displays a list of given products.
 */
//Constants used
const TWO_ITEMS = 2
const ONE_ITEM = 1

//Cache to measurement the row's height
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

  const renderRow = ({ index, key, style, parent, itemsPerRow }) => {
    const from = index * itemsPerRow
    const rowItems = products.slice(from, from + itemsPerRow)

    const containerClasses = classNames('vtex-gallery__row', {
      'vtex-gallery__row--two-columns': layoutMode === 'small' && mobile,
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
            {rowItems.map(item => (
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
            ))}
          </div>
        )}
      </CellMeasurer>
    )
  }

  const renderOnServer = () => products.map(item => (
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
  ))

  return (
    <div className="vtex-gallery pa3 bn">
      <NoSSR onSSR={renderOnServer()}>
        <Adopt
          mapper={{
            scroller: <WindowScroller />,
            autoSizer: <AutoSizer disableHeight />,
          }}
          mapProps={({ scroller: { height }, autoSizer: { width } }) => ({ height, width })}
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
      </NoSSR>
    </div >
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
