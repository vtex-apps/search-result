import React, { Component } from 'react'
import PropTypes from 'prop-types'
import VTEXClasses from './utils/css-classes'
import GalleryContent from './components/GalleryContent'
import GalleryHeader from './components/GalleryHeader'
import products from './resources/products.json'
import { sortProducts } from './utils/sort'

import './global.css'

const sortingOptions = [
  'sortBy.higherPrice',
  'sortBy.lowerPrice',
  'sortBy.nameAZ',
  'sortBy.nameZA',
]

/**
 * Canonical gallery that displays a list of given products.
 */
export default class Gallery extends Component {
  static uiSchema = {
    columnsQuantityLarge: {
      'ui:widget': 'radio',
      'ui:options': {
        inline: true,
      },
    },
    columnsQuantityMedium: {
      'ui:widget': 'radio',
      'ui:options': {
        inline: true,
      },
    },
  }

  static propTypes = {
    /** Quantity of columns when the viewport is large.*/
    columnsQuantityLarge: GalleryContent.propTypes.columnsQuantityLarge,
    /** Quantity of columns when the viewport is medium.*/
    columnsQuantityMedium: GalleryContent.propTypes.columnsQuantityMedium,
    /** Products to be displayed */
    products: GalleryContent.propTypes.productList,
    /** Query used to find the products */
    search: PropTypes.string.isRequired,
  }

  static defaultProps = {
    columnsQuantityLarge: 5,
    columnsQuantityMedium: 3,
    products: products,
    search: '',
  }

  static schema = {
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

  componentWillMount() {
    this.setState({
      products: sortProducts(this.props.products, sortingOptions[0]),
      selectedSort: 0,
    })
  }

  handleSortChange = (e, value) => {
    this.setState({
      selectedSort: sortingOptions.indexOf(value),
      products: sortProducts(this.state.products, value),
    })
  }

  render() {
    return (
      <div className={`${VTEXClasses.MAIN_CLASS} w-100 pa3`}>
        <GalleryHeader
          search={this.props.search}
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
