import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { graphql, compose } from 'react-apollo'
import { equals } from 'ramda'

import Spinner from '@vtex/styleguide/lib/Spinner'
import Gallery from './components/Gallery'
import SearchHeader from './components/SearchHeader'
import SearchFilter from './components/SearchFilter'
import SelectedFilters from './components/SelectedFilters'

import searchQuery from './graphql/searchQuery.gql'
import facetsQuery from './graphql/facetsQuery.gql'

import { getFacetsFromURL, getSearchParamsFromURL, getSelecteds, countSelecteds } from './constants/SearchHelpers'
import SortOptions from './constants/SortOptions'
import VTEXClasses from './constants/CSSClasses'
import './global.css'

/**
 * Search Result Component.
 */
class SearchResult extends Component {
  renderSearchFilters() {
    const { facetsQuery, searchQuery } = this.props
    const facets = facetsQuery.facets || {}
    const query = searchQuery.variables.query
    const map = searchQuery.variables.map
    const orderBy = searchQuery.variables.orderBy
    const selecteds = getSelecteds(query, map)
    const keys = Object.keys(facets)
    keys.splice(keys.indexOf('__typename'), 1)

    return keys.map(key => {
      if (key === 'SpecificationFilters') {
        return facets[key].map(filter => {
          return (
            <SearchFilter key={filter.name} title={filter.name} options={filter.facets}
              type={key} selecteds={selecteds[key]}
              query={query} map={map} orderBy={orderBy} disabled={countSelecteds(selecteds) === 1} />)
        })
      }
      return (
        <SearchFilter key={key} title={key} options={facets[key]} type={key}
          query={query} map={map} orderBy={orderBy} disabled={countSelecteds(selecteds) === 1}
          selecteds={selecteds[key]} />)
    })
  }

  getRecordsFiltered() {
    const { searchQuery, facetsQuery } = this.props
    if (facetsQuery && facetsQuery.facets) {
      const facets = facetsQuery.facets
      if (facets && facets.Departments) {
        let count = 0
        facets.Departments.map(dep => {
          count += dep.Quantity
        })
        return count
      }
    } else {
      return (searchQuery.products && searchQuery.products.length) || 0
    }
  }

  render() {
    const { facetsQuery, searchQuery } = this.props
    const query = searchQuery && searchQuery.variables.query
    const map = searchQuery && searchQuery.variables.map
    const orderBy = searchQuery && searchQuery.variables.orderBy
    const selecteds = getSelecteds(query, map)
    const isLoading = searchQuery && searchQuery.loading || facetsQuery && facetsQuery.loading
    const products = (searchQuery && searchQuery.products) || []

    return (
      <div className={`${VTEXClasses.MAIN_CLASS} w-100 pa3 dib`}>
        <div className="w-100 w-20-m w-20-l fl">
          <SelectedFilters selecteds={selecteds} query={query} map={map}
            orderBy={orderBy} disabled={countSelecteds(selecteds) === 1} />
          {this.renderSearchFilters()}
        </div>
        <div className="w-100 w-70-m w-80-l fl">
          <SearchHeader
            from={products.length ? 1 : 0}
            to={products.length}
            query={query}
            map={map}
            recordsFiltered={this.getRecordsFiltered()}
            selectedSort={orderBy}
            sortingOptions={SortOptions}
          />
          {
            isLoading ? (
              <div className="w-100 flex justify-center">
                <div className="w3 ma0">
                  <Spinner />
                </div>
              </div>
            ) : (
              <Gallery products={products} />
            )
          }
        </div>
      </div>
    )
  }
}

const SearchResultWithData = compose(
  graphql(facetsQuery, { name: 'facetsQuery',
    options: (props) => {
      const propsFacets = props.map && props.pathName && `${props.pathName}?map=${props.map}`
      const facets = propsFacets || (props.pathName && getFacetsFromURL(props.pathName))
      return ({
        variables: { facets },
        ssr: !!facets,
      })
    },
  }),
  graphql(searchQuery, { name: 'searchQuery',
    options: (props) => {
      const query = props.pathName
      const map = props.map || (query && getSearchParamsFromURL(query).map)
      const orderBy = props.orderBy
      return {
        variables: { query, map, orderBy },
        ssr: !!query,
      }
    },
  }),
)(SearchResult)

SearchResult.uiSchema = SearchResultWithData.uiSchema = {
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

SearchResult.schema = SearchResultWithData.schema = {
  title: 'Search Result',
  description: 'Search Result Wrapper',
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

SearchResult.propTypes = SearchResultWithData.propTypes = {
  /** Quantity of columns when the viewport is large.*/
  columnsQuantityLarge: PropTypes.number,
  /** Quantity of columns when the viewport is medium.*/
  columnsQuantityMedium: PropTypes.number,
  /** Products to be displayed */
  products: PropTypes.array,
  /** Pathname used to find the products */
  pathName: PropTypes.string,
  map: PropTypes.string,
  orderBy: PropTypes.string,
  facetsQuery: PropTypes.shape({
    Departments: PropTypes.arrayOf(PropTypes.shape({
      Quantity: PropTypes.number.isRequired,
      Link: PropTypes.string.isRequired,
      Name: PropTypes.string.isRequired,
    })),
    Brands: PropTypes.arrayOf(PropTypes.shape({
      Quantity: PropTypes.number.isRequired,
      Link: PropTypes.string.isRequired,
      Name: PropTypes.string.isRequired,
    })),
    SpecificationFilters: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      facets: PropTypes.shape({
        Quantity: PropTypes.number.isRequired,
        Link: PropTypes.string.isRequired,
        Name: PropTypes.string.isRequired,
      }),
    })),
  }),
  searchQuery: PropTypes.shape({
    products: PropTypes.arrayOf(
      PropTypes.shape({
        productId: PropTypes.string.isRequired,
        productName: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        categories: PropTypes.array,
        link: PropTypes.string,
        linkText: PropTypes.string.isRequired,
        brand: PropTypes.string,
        items: PropTypes.arrayOf(
          PropTypes.shape({
            itemId: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            referenceId: PropTypes.arrayOf(
              PropTypes.shape({
                Value: PropTypes.string.isRequired,
              })
            ),
            images: PropTypes.arrayOf(
              PropTypes.shape({
                imageUrl: PropTypes.string.isRequired,
                imageTag: PropTypes.string.isRequired,
              })
            ).isRequired,
            sellers: PropTypes.arrayOf(
              PropTypes.shape({
                commertialOffer: PropTypes.shape({
                  Price: PropTypes.number.isRequired,
                  ListPrice: PropTypes.number.isRequired,
                }).isRequired,
              })
            ).isRequired,
          })
        ).isRequired,
      })
    ),
  }),
}

SearchResult.defaultProps = SearchResultWithData.defaultProps = {
  columnsQuantityLarge: 5,
  columnsQuantityMedium: 3,
  products: [],
  orderBy: SortOptions[0].value,
  query: '',
  map: '',
}

export default SearchResultWithData
