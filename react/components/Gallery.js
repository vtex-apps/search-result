import React, { Component } from 'react'
import { PropTypes } from 'prop-types'

import VTEXClasses from '../constants/CSSClasses'
import GalleryItem from './GalleryItem'

/**
 * Canonical gallery that displays a list of given products.
 */
export default class Gallery extends Component {
  static propTypes = {
    /** Quantity of columns when the viewport is large.*/
    columnsQuantityLarge: PropTypes.number,
    /** Quantity of columns when the viewport is medium.*/
    columnsQuantityMedium: PropTypes.number,
    /** Products to be displayed */
    products: PropTypes.arrayOf(GalleryItem.propTypes.item),
  }

  static defaultProps = {
    columnsQuantityLarge: 5,
    columnsQuantityMedium: 3,
    products: [],
  }

  getWidthClass() {
    switch(this.props.columnsQuantityLarge) {
      case 5:
        return "w-100 w-40-m w-20-l"
      case 4:
        return "w-100 w-40-m w-25-l"
      case 3:
        return "w-100 w-40-m w-third-l"
    }
  }

  render() {
    return (
      <div className={`${VTEXClasses.GALLERY_CLASS} pa3 w-100 flex flex-wrap justify-around`}>
        {this.props.products.map(item => {
          return (
            <div
              key={item.productId}
              className={`${VTEXClasses.GALLERY_ITEM_CLASS} ${this.getWidthClass()} flex mt2 pa1 fl`}
            >
              <GalleryItem item={item} />
            </div>
          )
        })}
      </div>
    )
  }
}
