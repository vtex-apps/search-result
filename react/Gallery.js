import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'react-apollo'
import VTEXClasses from './utils/css-classes'
import productsQuery from './graphql/products-query.gql'
import GalleryContent from './components/GalleryContent'
import Spinner from '@vtex/styleguide/lib/Spinner'

const DEFAULT_MAX_ITEMS = 10

class Gallery extends React.Component {
  render() {
    const { data } = this.props
    const products = !data || data['error'] ? [] : data.products

    console.log(data)

    if (this.props.data.loading) {
      return (
        <div className="w-100 flex justify-center">
          <div className="w3 ma0">
            <Spinner />
          </div>
        </div>
      )
    }

    return (
      <GalleryContent
        products={products}
        {...this.props}
        className={VTEXClasses.MAIN_CLASS}
      />
    )
  }
}

Gallery.propTypes = {
  /** Quantity of columns when the viewport is large.*/
  columnsQuantityLarge: GalleryContent.propTypes.columnsQuantityLarge,
  /** Quantity of columns when the viewport is medium.*/
  columnsQuantityMedium: GalleryContent.propTypes.columnsQuantityMedium,
  /** Graphql data response. */
  data: PropTypes.shape({
    products: GalleryContent.propTypes.products,
    loading: PropTypes.bool.isRequired,
  }),
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
    },
    columnsQuantityMedium: {
      title: 'Columns quantity (Medium Viewport)',
      type: 'number',
      enum: [2, 3],
    },
  },
}

const options = {
  options: ({
    category,
    collection,
    orderBy,
    maxItems = DEFAULT_MAX_ITEMS,
  }) => ({
    variables: {
      category,
      collection,
      specificationFilters: [],
      orderBy,
      from: 0,
      to: maxItems - 1,
    },
    ssr: false,
  }),
}

export default graphql(productsQuery, options)(Gallery)
