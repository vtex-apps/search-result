import React, { Component } from 'react'
import { PropTypes } from 'prop-types'

import VTEXClasses from '../constants/CSSClasses'
import { productShape } from '../constants/PropTypes'
import GalleryItem from './GalleryItem'

/**
 * Canonical gallery that displays a list of given products.
 */
export default class Gallery extends Component {
  static propTypes = {
    /** Maximum number of items per line. */
    maxItemsPerLine: PropTypes.number.isRequired,
    /** Maximum number of items per page. */
    maxItemsPerPage: PropTypes.number.isRequired,
    /** Products to be displayed. */
    products: PropTypes.arrayOf(productShape),
    /** ProductSummary props. */
    summary: PropTypes.any,
  }

  static defaultProps = {
    maxItemsPerLine: 5,
    maxItemsPerPage: 10,
    products: [],
  }

  getWidthClass() {
    switch (this.props.maxItemsPerLine) {
      case 5:
        return 'w-100 w-50-m w-20-l'
      case 4:
        return 'w-100 w-50-m w-25-l'
      case 3:
        return 'w-100 w-50-m w-third-l'
    }
  }

  render() {
    return (
      <div className={`${VTEXClasses.GALLERY_CLASS} pa3 w-100 flex flex-wrap justify-start`}>
        {this.props.products.map(item => {
          return (
            <div
              key={item.productId}
              className={`${VTEXClasses.GALLERY_ITEM_CLASS} ${this.getWidthClass()} flex mv2 pa1 fl`}
            >
              <GalleryItem item={item} summary={this.props.summary} />
            </div>
          )
        })}
      </div>
    )
  }
}
