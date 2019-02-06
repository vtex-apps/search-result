import React, { Component } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { map } from 'ramda'

import { withRuntimeContext, NoSSR } from 'vtex.render-runtime'

import { productShape } from './constants/propTypes'
import GalleryItem from './components/GalleryItem'

import searchResult from './searchResult.css'

/**
 * Canonical gallery that displays a list of given products.
 */
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
    } = this.props

    const containerClasses = classNames(`${searchResult.gallery} pa3 bn`, {
      [searchResult.galleryTwoColumns]: layoutMode === 'small' && mobile,
    })

    return (
      <NoSSR onSSR={this.handleSSR()}>
        <div className={containerClasses}>
          {map(this.renderItem, products)}
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
}

export default withRuntimeContext(Gallery)
