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

    return `${columnSizeLarge} ${columnSizeMedium} w-100-s mt2`
  }

  render() {
    const columnClass = this.generateColunmCss()

    return (
      <div className="flex flex-wrap">
        {this.props.productList.map(item => {
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
    )
  }
}

GalleryContent.propTypes = {
  columnsQuantityLarge: PropTypes.number.isRequired,
  columnsQuantityMedium: PropTypes.number.isRequired,
  productList: PropTypes.arrayOf(GalleryItem.propTypes.item),
}

export default GalleryContent
