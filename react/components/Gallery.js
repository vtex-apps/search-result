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

  calculateColunmSize(nColumns) {
    let result
    switch (nColumns) {
      case 3:
        result = 'w-third'
        break
      case 4:
        result = 'w-25'
        break
      case 5:
        result = 'w-20'
        break
      default:
        result = 'w-25'
    }
    return result
  }

  generateColunmCss() {
    const { columnsQuantityLarge, columnsQuantityMedium } = this.props

    const columnSizeLarge = `${this.calculateColunmSize(columnsQuantityLarge)}-l`
    const columnSizeMedium = `${this.calculateColunmSize(columnsQuantityMedium)}-m`

    return `${columnSizeLarge} ${columnSizeMedium} w-100-s mt2`
  }

  render() {
    const columnClass = this.generateColunmCss()
    return (
      <div className={`${VTEXClasses.MAIN_CLASS} w-100 pa3`}>
        <div className="flex flex-wrap">
          {this.props.products.map(item => {
            return (
              <div
                key={item.productId}
                className={`${columnClass} ${VTEXClasses.ITEM_CLASS} pa1`}
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
