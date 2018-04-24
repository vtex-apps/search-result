import React from 'react'
import PropTypes from 'prop-types'
import GalleryItem from './GalleryItem'

import VTEXClasses from '../utils/css-classes'

function calculateColunmSize(nColumns) {
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

class GalleryContent extends React.Component {
  generateColunmCss() {
    const { columnsQuantityLarge, columnsQuantityMedium } = this.props

    const columnSizeLarge = `${calculateColunmSize(columnsQuantityLarge)}-l`
    const columnSizeMedium = `${calculateColunmSize(columnsQuantityMedium)}-m`
    const columnSizeSmall = 'w-100-s'

    return `outline ${columnSizeLarge} ${columnSizeMedium} ${columnSizeSmall} mt2`
  }

  render() {
    const columnClass = this.generateColunmCss()

    return (
      <div className="w-100 pa2">
        <div className="flex flex-wrap justify-between">
          {this.props.products.map(item => {
            return (
              <div
                key={item.productId}
                className={`${columnClass} ${VTEXClasses.ITEM_CLASS} pa4`}
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

GalleryContent.propTypes = {
  columnsQuantityLarge: PropTypes.number.isRequired,
  columnsQuantityMedium: PropTypes.number.isRequired,
  products: PropTypes.arrayOf(GalleryItem.propTypes.item),
}

export default GalleryContent
