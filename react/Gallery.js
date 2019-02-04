import React, { Component } from 'react'
import classNames from 'classnames'
import { List, WindowScroller, AutoSizer, CellMeasurer, CellMeasurerCache } from 'react-virtualized'
import PropTypes from 'prop-types'
import { Adopt } from 'react-adopt'
import { map } from 'ramda'

import { withRuntimeContext, NoSSR } from 'vtex.render-runtime'

import { productShape } from './constants/propTypes'
import GalleryItem from './components/GalleryItem'

import searchResult from './searchResult.css'

import 'react-virtualized/styles.css'

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

  /**
 *  Cache to measure the rows height
 * */
  cache = new CellMeasurerCache({
    fixedWidth: true,
    keyMapper: () => 1,
  })

  renderItem = item => {
    const { summary, layoutMode } = this.props
    
    return (
      <div
        key={item.productId}
        className={`${searchResult.galleryItem} mv2 pa1`}
      >
        <GalleryItem
          item={item}
          summary={summary}
          displayMode={layoutMode}
        />
      </div>
    )
  }

  renderRow = ({ index, key, style, parent, itemsPerRow }) => {
    const { products, layoutMode, runtime: { hints: { mobile } } } = this.props

    const from = index * itemsPerRow
    const rowItems = products.slice(from, from + itemsPerRow)

    const containerClasses = classNames(searchResult.galleryRow, 'flex', {
      [searchResult.galleryTwoColumns]: layoutMode === 'small' && mobile,
      'justify-center': mobile,
    })

    return (
      <CellMeasurer
        cache={this.cache}
        columnIndex={0}
        key={key}
        parent={parent}
        rowIndex={index}
      >
        <div className={containerClasses} key={key} style={style}>
          {map(this.renderItem, rowItems)}
        </div>
      </CellMeasurer>
    )
  }

  handleSSR() {
    const { products, layoutMode, runtime: { hints: { mobile } } } = this.props

    const ssrContainer = classNames(`${searchResult.gallery} pa3 bn`, {
      [searchResult.galleryTwoColumns]: layoutMode === 'small' && mobile,
    })

    return (
      <div className={ssrContainer}>
        {map(this.renderItem, products)}
      </div>
    )
  }

  updateCache = layoutMode => {
    this.setState({ prevLayoutMode: layoutMode })
    this.cache.clearAll()
  }

  render() {
    const {
      products,
      layoutMode,
      runtime: { hints: { mobile } },
      itemWidth,
    } = this.props
    // Maps the WindowScroller and the AutoSizer props to a more adequate set of params
    const mapContainerProps = ({ scroller: { height, scrollTop, isScrolling }, autoSizer: { width } }) => ({ width, height, scrollTop, isScrolling })

    // Updates the cache to recalculate heights if the layoutMode changes
    if (layoutMode !== this.state.prevLayoutMode) {
      this.updateCache(layoutMode)
    }

    return (
      <NoSSR onSSR={this.handleSSR()}>
        <div className={`${searchResult.gallery} pa3 bn`}>
          <Adopt
            mapper={{
              scroller: <WindowScroller />,
              autoSizer: <AutoSizer disableHeight />,
            }}
            mapProps={mapContainerProps}
          >
            {({ width, height, scrollTop, isScrolling }) => {
              const itemsPerRow = (layoutMode === 'small' && mobile) ? TWO_ITEMS : (Math.floor(width / itemWidth) || ONE_ITEM)
              const nRows = Math.ceil(products.length / itemsPerRow)

              return (
                <List
                  key={layoutMode}
                  deferredMeasurementCache={this.cache}
                  overscanRowCount={2}
                  isScrolling={isScrolling}
                  autoHeight
                  scrollTop={scrollTop}
                  width={width}
                  height={height}
                  rowCount={nRows}
                  rowHeight={this.cache.rowHeight}
                  rowRenderer={args => this.renderRow({ ...args, itemsPerRow })}
                />
              )
            }}
          </Adopt>
        </div >
      </NoSSR>
    )
  }
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
  itemWidth: 300,
}

export default withRuntimeContext(Gallery)
