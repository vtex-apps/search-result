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

  render() {
    return (
      <div className={`${VTEXClasses.GALLERY_CLASS} w-100 pa3`}>
        <div className="flex flex-wrap justify-center justify-start-ns">
          {this.props.products.map(item => {
            return (
              <div
                key={item.productId}
                className={`${VTEXClasses.GALLERY_ITEM_CLASS} mt2 pa1`}
              >
                <GalleryItem item={item} />
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}
