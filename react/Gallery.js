import React from 'react'
import VTEXClasses from './utils/css-classes'
import GalleryContent from './components/GalleryContent'
import GalleryHeader from './components/GalleryHeader'
import products from './resources/products.json'
import { sortByPrice, sortByName } from './utils/sort'

import './global.css'

const sortingOptions = [
  //  'sortBy.relevance',
  'sortBy.higherPrice',
  'sortBy.lowerPrice',
  'sortBy.nameAZ',
  'sortBy.nameZA',
  //  'sortBy.bestSellers',
]

class Gallery extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedSort: 0,
      products: props.products,
    }
  }

  componentWillMount() {
    console.log('will mount')
    this.sortProducts()
  }

  sortProducts() {
    let sortFunction
    let asc

    const value = sortingOptions[this.state.selectedSort]

    switch (value) {
      case 'sortBy.lowerPrice':
        sortFunction = sortByPrice
        asc = true
        break
      case 'sortBy.higherPrice':
        sortFunction = sortByPrice
        asc = false
        break
      case 'sortBy.nameAZ':
        sortFunction = sortByName
        asc = true
        break
      case 'sortBy.nameZA':
        sortFunction = sortByName
        asc = false
        break
      default:
        sortFunction = sortByPrice
        asc = false
        break
    }

    console.log('value asc', value, asc)

    this.setState({
      products: products.sort((a, b) => sortFunction(a, b, asc)),
    })
  }

  handleSortChange = (e, value) => {
    this.setState({
      selectedSort: sortingOptions.indexOf(value),
    })

    this.sortProducts()
  }

  render() {
    return (
      <div className={`${VTEXClasses.MAIN_CLASS} w-100 pa3`}>
        <GalleryHeader
          query={'celulares'}
          selectedSort={this.state.selectedSort}
          quantity={this.props.products.length}
          onSortChange={this.handleSortChange}
          sortingOptions={sortingOptions}
        />
        <GalleryContent productList={this.state.products} {...this.props} />
      </div>
    )
  }
}

Gallery.propTypes = {
  /** Quantity of columns when the viewport is large.*/
  columnsQuantityLarge: GalleryContent.propTypes.columnsQuantityLarge,
  /** Quantity of columns when the viewport is medium.*/
  columnsQuantityMedium: GalleryContent.propTypes.columnsQuantityMedium,
  /** Products to be displayed */
  products: GalleryContent.propTypes.products,
}

Gallery.defaultProps = {
  columnsQuantityLarge: 5,
  columnsQuantityMedium: 3,
  products: products,
}

Gallery.schema = {
  title: 'Gallery',
  description: 'A product gallery',
  type: 'object',
  properties: {
    columnsQuantityLarge: {
      title: 'Columns quantity (Large Viewport)',
      type: 'number',
      enum: [3, 4, 5],
      default: 5,
    },
    columnsQuantityMedium: {
      title: 'Columns quantity (Medium Viewport)',
      type: 'number',
      enum: [2, 3],
      default: 3,
    },
  },
}

export default Gallery
