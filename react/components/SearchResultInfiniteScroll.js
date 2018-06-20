import '../global.css'

import PropTypes from 'prop-types'
import { concat, contains, reduce, values } from 'ramda'
import React, { Component } from 'react'
import { compose, graphql } from 'react-apollo'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Spinner } from 'vtex.styleguide'

import VTEXClasses from '../constants/CSSClasses'
import { facetsQueryShape, mapType, orderType, schemaPropsTypes, searchQueryShape } from '../constants/propTypes'
import { getPagesArgs } from '../constants/SearchHelpers'
import SortOptions from '../constants/SortOptions'
import facetsQuery from '../graphql/facetsQuery.gql'
import searchQuery from '../graphql/searchQuery.gql'
import Gallery from './Gallery'
import SearchFilter from './SearchFilter'
import SearchHeader from './SearchHeader'
import SelectedFilters from './SelectedFilters'

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
class SearchResultInfiniteScroll extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentPage: props.page,
    }
  }

  getLinkProps = ({ opt, variables, isSelected, type, pageNumber }) => {
    let { query, map, orderBy } = this.props.searchQuery.variables
    if (variables) {
      query = variables.query || query
      map = variables.map || map
      orderBy = variables.orderBy || orderBy
    }
    return getPagesArgs(opt, query, map, orderBy, isSelected, type, pageNumber)
  }

  renderSearchFilters() {
    if (!this.props.facetsQuery || !this.props.facetsQuery.facets) return

    const {
      facetsQuery: { facets },
      searchQuery,
    } = this.props
    const query = searchQuery.variables.query
    const map = searchQuery.variables.map
    const selecteds = this.getSelecteds(query, map)
    const isDisabled =
      this.countSelecteds(selecteds) === LIMIT_SELECTEDS_TO_DISABLE

    return Object.values(FACETS_KEYS).map(key => {
      if (facets[key]) {
        switch (key) {
          case FACETS_KEYS.Specifications: {
            return facets[key].map(filter => {
              return (
                <SearchFilter
                  key={filter.name}
                  title={filter.name}
                  options={filter.facets}
                  type={key}
                  selecteds={selecteds[key]}
                  getLinkProps={this.getLinkProps}
                  disabled={isDisabled}
                />
              )
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
              <SearchFilter
                key={key}
                title={CATEGORIES_FILTER_TITLE}
                options={categories}
                type={CATEGORIES_FILTER_TYPE}
                selecteds={selecteds.Departments}
                getLinkProps={this.getLinkProps}
                disabled={isDisabled}
              />
            )
          }
          default: {
            return (
              <SearchFilter
                key={key}
                title={key}
                options={facets[key]}
                type={key}
                getLinkProps={this.getLinkProps}
                disabled={isDisabled}
                selecteds={selecteds[key]}
              />
            )
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

  handleFetchMoreProducts = (prev, { fetchMoreResult }) => {
    if (!fetchMoreResult) return prev
    this.setState({ currentPage: this.state.currentPage + 1 })
    return {
      ...prev,
      products: [...prev.products, ...fetchMoreResult.products],
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
    const {
      facetsQuery,
      searchQuery,
      maxItemsPerLine,
      maxItemsPerPage,
      page,
      summary,
    } = this.props
    const products = (searchQuery && searchQuery.products) || []
    const query = searchQuery && searchQuery.variables.query
    const map = searchQuery && searchQuery.variables.map
    const orderBy = searchQuery && searchQuery.variables.orderBy
    const from = (page - 1) * maxItemsPerPage + 1
    const to = (page - 1) * maxItemsPerPage + products.length
    const selecteds = this.getSelecteds(query, map)
    const isLoading =
      (searchQuery && !searchQuery.products) ||
      (facetsQuery && facetsQuery.loading)
    const isFetchingMore =
      searchQuery && searchQuery.products && searchQuery.loading
    const disabled = this.countSelecteds(selecteds) === 1
    const recordsFiltered = this.getRecordsFiltered()

    return (
      <InfiniteScroll
        dataLength={products.length}
        next={() =>
          searchQuery.fetchMore({
            variables: {
              from: to,
              to: to + maxItemsPerPage - 1,
            },
            updateQuery: this.handleFetchMoreProducts,
          })
        }
        hasMore={products.length < recordsFiltered}>
        <div className={`${VTEXClasses.MAIN_CLASS} w-100 pa3 dib`}>
          <div className="w-100 w-30-m w-20-l fl pa3">
            <SelectedFilters
              {...{ selecteds, disabled }}
              getLinkProps={this.getLinkProps}
            />
            {this.renderSearchFilters()}
          </div>
          <div className="w-100 w-70-m w-80-l fl">
            <SearchHeader
              {...{ from, to, query, map, orderBy, recordsFiltered }}
              getLinkProps={this.getLinkProps}
            />
            {isLoading ? (
              this.renderSpinner()
            ) : (
              <Gallery {...{ products, maxItemsPerLine, summary }} />
            )}
            {isFetchingMore && this.renderSpinner()}
          </div>
        </div>
      </InfiniteScroll>
    )
  }
}

const SearchResultInfiniteScrollWithData = compose(
  graphql(facetsQuery, {
    name: 'facetsQuery',
    options: props => {
      const { path, map } = props
      const facets = `${path}?map=${map}`
      return {
        variables: { facets },
      }
    },
  }),
  graphql(searchQuery, {
    name: 'searchQuery',
    options: props => {
      const { path, map } = props
      const orderBy = props.orderBy
      const from = (props.page - 1) * props.maxItemsPerPage
      const to = from + props.maxItemsPerPage - 1
      return {
        variables: { query: path, map, orderBy, from, to },
        notifyOnNetworkStatusChange: true,
      }
    },
  })
)(SearchResultInfiniteScroll)

SearchResultInfiniteScroll.propTypes = SearchResultInfiniteScrollWithData.propTypes = {
  /** Path param. e.g: eletronics/smartphones */
  path: PropTypes.string,
  /** Map param. e.g: c,c */
  map: mapType.isRequired,
  /** Search result page. */
  page: PropTypes.number.isRequired,
  /** Search result ordernation. */
  orderBy: orderType,
  /** Facets graphql query. */
  facetsQuery: facetsQueryShape,
  /** Search graphql query. */
  searchQuery: searchQueryShape,
  ...schemaPropsTypes,
}

SearchResultInfiniteScroll.defaultProps = SearchResultInfiniteScrollWithData.defaultProps = {
  orderBy: SortOptions[0].value,
}

export default SearchResultInfiniteScrollWithData
