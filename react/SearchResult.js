import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { graphql, compose } from 'react-apollo'

import ProductSummary from 'vtex.product-summary/ProductSummary'
import Spinner from '@vtex/styleguide/lib/Spinner'
import Gallery from './components/Gallery'
import SearchHeader from './components/SearchHeader'
import SearchFilter from './components/SearchFilter'
import SelectedFilters from './components/SelectedFilters'

import searchQuery from './graphql/searchQuery.gql'
import facetsQuery from './graphql/facetsQuery.gql'

import {
  getFacetsFromURL,
  getSearchParamsFromURL,
  getPagesArgs,
} from './constants/SearchHelpers'
import SortOptions from './constants/SortOptions'
import VTEXClasses from './constants/CSSClasses'
import { facetsQueryShape, searchQueryShape } from './constants/PropTypes'
import './global.css'

const FACETS_KEYS = ['Departments', 'CategoriesTrees', 'Brands', 'SpecificationFilters']

/**
 * Search Result Component.
 */
class SearchResult extends Component {
  getLinkProps = (opt, variables, isSelected, type) => {
    let { query, map, orderBy } = this.props.searchQuery.variables
    if (variables) {
      query = variables.query || query
      map = variables.map || map
      orderBy = variables.orderBy || orderBy
    }
    return getPagesArgs(opt, query, map, orderBy, isSelected, type)
  }

  renderSearchFilters() {
    if (!this.props.facetsQuery || !this.props.facetsQuery.facets) return

    const { facetsQuery: { facets }, searchQuery } = this.props
    const query = searchQuery.variables.query
    const map = searchQuery.variables.map
    const selecteds = this.getSelecteds(query, map)
    const isDisabled = this.countSelecteds(selecteds) === 1

    return FACETS_KEYS.map(key => {
      if (facets[key]) {
        if (key === 'SpecificationFilters') {
          return facets[key].map(filter => {
            return (
              <SearchFilter key={filter.name} title={filter.name}
                options={filter.facets} type={key} selecteds={selecteds[key]}
                getLinkProps={this.getLinkProps} disabled={isDisabled} />)
          })
        } else if (key === 'CategoriesTrees') {
          let categories = []
          facets[key].map(filter => {
            if (selecteds.Departments.indexOf(filter.Name.toUpperCase()) !== -1) {
              categories = categories.concat(filter.Children)
            }
          })
          return (
            <SearchFilter key={key} title="Categories" options={categories}
              type="Departments" selecteds={selecteds.Departments}
              getLinkProps={this.getLinkProps} disabled={isDisabled} />)
        }
        return (
          <SearchFilter key={key} title={key} options={facets[key]}
            type={key} getLinkProps={this.getLinkProps}
            disabled={isDisabled} selecteds={selecteds[key]} />)
      }
    })
  }

  getSelecteds(query, map) {
    const selecteds = {
      SpecificationFilters: [],
      Departments: [],
      Brands: [],
      FullText: [],
    }

    if (!query && !map) return selecteds

    const pathValues = query.split('/')
    const mapValues = map.split(',')
    pathValues.map((val, i) => {
      const valDecoded = decodeURI(val.toUpperCase())
      if (i > mapValues.length - 1) {
        selecteds.Departments.push(valDecoded)
      } else {
        if (mapValues[i] === 'c') {
          selecteds.Departments.push(valDecoded)
        } else if (mapValues[i] === 'b') {
          selecteds.Brands.push(valDecoded)
        } else if (mapValues[i].indexOf('specificationFilter') !== -1) {
          selecteds.SpecificationFilters.push(valDecoded)
        } else if (mapValues[i] === 'ft') {
          selecteds.FullText = [valDecoded]
        }
      }
    })

    return selecteds
  }

  countSelecteds(selecteds) {
    let count = 0
    for (const key in selecteds) {
      if (selecteds[key]) {
        count += selecteds[key].length
      }
    }
    return count
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

  renderSpinner() {
    return (
      <div className="w-100 flex justify-center">
        <div className="w3 ma0">
          <Spinner />
        </div>
      </div>
    )
  }

  render() {
    const { facetsQuery, searchQuery, maxItemsPerLine, maxItemsPerPage, page, summary } = this.props
    const products = (searchQuery && searchQuery.products) || []
    const query = searchQuery && searchQuery.variables.query
    const map = searchQuery && searchQuery.variables.map
    const orderBy = searchQuery && searchQuery.variables.orderBy
    const from = ((page - 1) * maxItemsPerPage) + 1
    const to = ((page - 1) * maxItemsPerPage) + products.length
    const selecteds = this.getSelecteds(query, map)
    const isLoading = searchQuery && searchQuery.loading || facetsQuery && facetsQuery.loading
    const disabled = this.countSelecteds(selecteds) === 1
    const recordsFiltered = this.getRecordsFiltered()

    return (
      <div className={`${VTEXClasses.MAIN_CLASS} w-100 pa3 dib`}>
        <div className="w-100 w-30-m w-20-l fl pa3">
          <SelectedFilters {...{ selecteds, disabled }} getLinkProps={this.getLinkProps} />
          {this.renderSearchFilters()}
        </div>
        <div className="w-100 w-70-m w-80-l fl">
          <SearchHeader {...{ from, to, query, map, orderBy, recordsFiltered }}
            getLinkProps={this.getLinkProps} />
          { isLoading ? this.renderSpinner()
            : <Gallery {...{ products, maxItemsPerLine, summary }} /> }
        </div>
      </div>
    )
  }
}

const SearchResultWithData = compose(
  graphql(facetsQuery, { name: 'facetsQuery',
    options: (props) => {
      const query = props.pathName
      const propsFacets = props.map && query && `${query}?map=${props.map}`
      const facets = propsFacets || (query && getFacetsFromURL(query))
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
      const from = (props.page - 1) * props.maxItemsPerPage
      const to = from + props.maxItemsPerPage - 1
      return {
        variables: { query, map, orderBy, from, to },
        ssr: !!query,
      }
    },
  }),
)(SearchResult)

SearchResult.uiSchema = SearchResultWithData.uiSchema = {
  maxItemsPerLine: {
    'ui:widget': 'radio',
    'ui:options': {
      inline: true,
    },
  },
}

SearchResult.getSchema = SearchResultWithData.getSchema = (props) => {
  return {
    title: 'editor.search-result.title',
    description: 'editor.search-result.description',
    type: 'object',
    properties: {
      maxItemsPerLine: {
        title: 'editor.search-result.maxItemsPerLine.title',
        type: 'number',
        enum: [3, 4, 5],
        default: 5,
      },
      maxItemsPerPage: {
        title: 'editor.search-result.maxItemsPerPage.title',
        type: 'number',
        default: 10,
      },
      summary: {
        title: 'editor.search-result.summary.title',
        type: 'object',
        properties: ProductSummary.getSchema(props).properties,
      },
    },
  }
}

SearchResult.propTypes = SearchResultWithData.propTypes = {
  /** Maximum number of items per line. */
  maxItemsPerLine: PropTypes.number.isRequired,
  /** Maximum number of items per page. */
  maxItemsPerPage: PropTypes.number.isRequired,
  /** Query param. e.g: eletronics/smartphones */
  query: PropTypes.string,
  /** Map param. e.g: c,c */
  map: PropTypes.string,
  /** Search result page. */
  page: PropTypes.number.isRequired,
  /** Search result ordernation. */
  orderBy: PropTypes.string,
  /** Facets graphql query. */
  facetsQuery: facetsQueryShape,
  /** Search graphql query. */
  searchQuery: searchQueryShape,
}

SearchResult.defaultProps = SearchResultWithData.defaultProps = {
  maxItemsPerLine: 5,
  maxItemsPerPage: 10,
  orderBy: SortOptions[0].value,
  pathName: '',
  map: '',
  page: 1,
}

export default SearchResultWithData
