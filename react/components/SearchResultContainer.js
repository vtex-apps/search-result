import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { graphql, compose } from 'react-apollo'
import { reduce, contains, concat, values } from 'ramda'

import { ProductSummary } from 'vtex.product-summary'
import { Spinner } from 'vtex.styleguide'
import Gallery from './Gallery'
import SearchHeader from './SearchHeader'
import SearchFilter from './SearchFilter'
import SelectedFilters from './SelectedFilters'

import searchQuery from '../graphql/searchQuery.gql'
import facetsQuery from '../graphql/facetsQuery.gql'

import {
  getFacetsFromURL,
  getQueryAndMap,
  getPagesArgs,
} from '../constants/SearchHelpers'
import SortOptions from '../constants/SortOptions'
import VTEXClasses from '../constants/CSSClasses'
import { facetsQueryShape, searchQueryShape } from '../constants/propTypes'
import '../global.css'

const FACETS_KEYS = {
  Departments: 'Departments',
  Categories: 'CategoriesTrees',
  Brands: 'Brands',
  Specifications: 'SpecificationFilters',
}

const LIMIT_SELECTEDS_TO_DISABLE = 1
const CATEGORIES_FILTER_TITLE = 'search.filter.title.categories'
const CATEGORIES_FILTER_TYPE = 'Departments'
const KEY_MAP_CATEGORY = 'c'
const KEY_MAP_BRAND = 'b'
const KEY_MAP_TEXT = 'ft'
const PATH_SEPARATOR = '/'
const MAP_SEPARATOR = ','

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
    const isDisabled = this.countSelecteds(selecteds) === LIMIT_SELECTEDS_TO_DISABLE

    return Object.values(FACETS_KEYS).map(key => {
      if (facets[key]) {
        switch (key) {
          case FACETS_KEYS.Specifications: {
            return facets[key].map(filter => {
              return (
                <SearchFilter key={filter.name} title={filter.name}
                  options={filter.facets} type={key} selecteds={selecteds[key]}
                  getLinkProps={this.getLinkProps} disabled={isDisabled} />)
            })
          }
          case FACETS_KEYS.Categories: {
            let categories = []
            facets[key].map(filter => {
              if (contains(filter.Name.toUpperCase(), selecteds.Departments)) {
                categories = categories.concat(filter.Children)
              }
            })
            return (
              <SearchFilter key={key} title={CATEGORIES_FILTER_TITLE} options={categories}
                type={CATEGORIES_FILTER_TYPE} selecteds={selecteds.Departments}
                getLinkProps={this.getLinkProps} disabled={isDisabled} />)
          }
          default: {
            return (
              <SearchFilter key={key} title={key} options={facets[key]}
                type={key} getLinkProps={this.getLinkProps}
                disabled={isDisabled} selecteds={selecteds[key]} />)
          }
        }
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

    const pathValues = query.split(PATH_SEPARATOR)
    const mapValues = map.split(MAP_SEPARATOR)
    pathValues.map((term, index) => {
      const termDecoded = decodeURI(term.toUpperCase())
      if (index >= mapValues.length) {
        selecteds.Departments.push(termDecoded)
      } else {
        switch (mapValues[index]) {
          case KEY_MAP_CATEGORY: {
            selecteds.Departments.push(termDecoded)
            break
          }
          case KEY_MAP_BRAND: {
            selecteds.Brands.push(termDecoded)
            break
          }
          case KEY_MAP_TEXT: {
            selecteds.FullText = [termDecoded]
            break
          }
          default: {
            selecteds.SpecificationFilters.push(termDecoded)
            break
          }
        }
      }
    })

    return selecteds
  }

  countSelecteds(selecteds) {
    return reduce(concat, [])(values(selecteds)).length
  }

  getRecordsFiltered = () => {
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
      const query = props.query
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
      const query = props.query
      const map = props.map || (query && getQueryAndMap(query).map)
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
  query: '',
  map: '',
  page: 1,
}

export default SearchResultWithData
