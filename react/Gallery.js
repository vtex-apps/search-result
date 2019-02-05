import React, { Component } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { map, splitEvery, toString, head, last } from 'ramda'

import { withRuntimeContext, NoSSR } from 'vtex.render-runtime'

import { productShape } from './constants/propTypes'
import GalleryItem from './components/GalleryItem'

import searchResult from './searchResult.css'

/**
 * Canonical gallery that displays a list of given products.
 */

const TWO_ITEMS = 2
const ONE_ITEM = 1

class Gallery extends Component {
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

  renderRow = (rowItems) => {
    const { layoutMode, runtime: { hints: { mobile } } } = this.props

    const containerClasses = classNames(searchResult.galleryRow, {
      [searchResult.galleryTwoColumns]: layoutMode === 'small' && mobile,
    })

    const key = toString(head(rowItems)) + toString(last(rowItems))
    return (
      <div className={containerClasses} key={key}>
        {map(this.renderItem, rowItems)}
      </div>
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

  render() {
    const {
      products,
      layoutMode,
      runtime: { hints: { mobile } },
      itemWidth,
    } = this.props

    //TODO check how the heck can I see the maximum number of items per row
    // const itemsPerRow = (layoutMode === 'small' && mobile) ? TWO_ITEMS : (5 || ONE_ITEM)
    // const nRows = Math.ceil(products.length / itemsPerRow)

    const itemsPerRow = 5

    return (
      <NoSSR onSSR={this.handleSSR()}>
        <div className={`${searchResult.gallery} pa3 bn`}>
          {map(this.renderRow, splitEvery(itemsPerRow, products))}
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
