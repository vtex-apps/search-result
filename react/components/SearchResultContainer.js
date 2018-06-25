import '../global.css'

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { compose, graphql } from 'react-apollo'
import { Spinner } from 'vtex.styleguide'

import VTEXClasses from '../constants/CSSClasses'
import {
  facetsQueryShape,
  searchQueryShape,
  mapType,
  orderType,
  schemaPropsTypes,
} from '../constants/propTypes'
import {
  getPagesArgs,
  stripPath,
  joinPathWithRest,
  getCategoriesFromQuery,
  findInTree,

} from '../constants/SearchHelpers'
import SortOptions from '../constants/SortOptions'
import facetsQuery from '../graphql/facetsQuery.gql'
import searchQuery from '../graphql/searchQuery.gql'
import Gallery from './Gallery'
import SearchFilter from './SearchFilter'
import SearchFooter from './SearchFooter'
import SearchHeader from './SearchHeader'
import SelectedFilters from './SelectedFilters'

const FACETS_KEYS = {
  Departments: 'Departments',
  Categories: 'CategoriesTrees',
  Brands: 'Brands',
  Specifications: 'SpecificationFilters',
}

const CATEGORIES_FILTER_TITLE = 'search.filter.title.categories'
const CATEGORIES_FILTER_TYPE = 'Categories'
const KEY_MAP_CATEGORY = 'c'
const KEY_MAP_BRAND = 'b'
const KEY_MAP_TEXT = 'ft'
const PATH_SEPARATOR = '/'
const MAP_SEPARATOR = ','

/**
 * Search Result Component.
 */
class SearchResultContainer extends Component {
  getLinkProps = ({ opt, type, isSelected, ordenation, pageNumber }) => {
    const { path, rest, map, pagesPath } = this.props
    let { variables: { orderBy } } = this.props.searchQuery
    orderBy = ordenation || ordenation
    return getPagesArgs(
      opt.Name,
      type,
      opt.Link,
      path,
      rest,
      { map, orderBy, pageNumber },
      pagesPath,
      isSelected
    )
  }

  getCategories() {
    const {
      facetsQuery,
      searchQuery: { variables: { query, map } },
      pagesPath,
    } = this.props
    const { CategoriesTrees: tree } = facetsQuery.facets
    const categories = getCategoriesFromQuery(query, map)
    const category = findInTree(tree, categories, 0)
    if (pagesPath === 'store/department') {
      return tree[0].Children
    } else if (category) {
      return category.Children || tree[0].Children
    }
    return null
  }

  renderSearchFilters() {
    if (!this.props.facetsQuery || !this.props.facetsQuery.facets) return

    let { facetsQuery: { facets } } = this.props
    facets = { ...facets }
    const selecteds = this.getSelecteds()
    delete facets[FACETS_KEYS.Departments]

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
                />
              )
            })
          }
          case FACETS_KEYS.Categories: {
            const categories = this.getCategories()
            if (categories && categories.length) {
              return (
                <SearchFilter
                  key={CATEGORIES_FILTER_TITLE}
                  oneSelectedCollapse
                  title={CATEGORIES_FILTER_TITLE}
                  options={categories}
                  type={CATEGORIES_FILTER_TYPE}
                  selecteds={selecteds.Categories}
                  getLinkProps={this.getLinkProps}
                />
              )
            }
            break
          }
          default: {
            return (
              <SearchFilter
                key={key}
                title={key}
                options={facets[key]}
                type={key}
                getLinkProps={this.getLinkProps}
                selecteds={selecteds[key]}
              />
            )
          }
        }
      }
    })
  }

  getSelecteds() {
    const { rest, path, map } = this.props
    const restValues = (rest && rest.split(MAP_SEPARATOR)) || []
    const pathValues = stripPath(path).split(PATH_SEPARATOR)
    const mapValues = map.split(MAP_SEPARATOR)
    const selecteds = {
      Categories: [],
      Brands: [],
      FullText: [],
      SpecificationFilters: [],
    }
    restValues.map((term, index) => {
      const termDecoded = decodeURI(term.toUpperCase())
      const mapValue = mapValues[pathValues.length + index]

      switch (mapValue) {
        case KEY_MAP_CATEGORY: {
          selecteds.Categories.push(termDecoded)
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
    })

    return selecteds
  }

  getRecordsFiltered() {
    const { searchQuery, facetsQuery } = this.props
    if (facetsQuery && facetsQuery.facets) {
      return facetsQuery.facets.Departments[0].Quantity
    }
    return (searchQuery.products && searchQuery.products.length) || 0
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
      facetsQuery: { loading: facetsLoading },
      searchQuery: {
        products: searchedProducts,
        variables: { query, map, orderBy },
        loading: searchLoading,
      },
      maxItemsPerLine,
      maxItemsPerPage,
      page,
      summary,
    } = this.props
    const products = searchedProducts || []
    const from = (page - 1) * maxItemsPerPage + 1
    const to = (page - 1) * maxItemsPerPage + products.length
    const selecteds = this.getSelecteds()
    const isLoading = searchLoading || facetsLoading
    const recordsFiltered = this.getRecordsFiltered()

    return (
      <div className={`${VTEXClasses.MAIN_CLASS} w-100 pa3 dib`}>
        <div className="w-100 w-30-m w-20-l fl pa3">
          <SelectedFilters selecteds={selecteds} getLinkProps={this.getLinkProps} />
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
          <SearchFooter
            {...{ recordsFiltered, page, maxItemsPerPage }}
            getLinkProps={this.getLinkProps}
          />
        </div>
      </div>
    )
  }
}

const SearchResultContainerWithData = compose(
  graphql(facetsQuery, { name: 'facetsQuery',
    options: (props) => {
      const { path, rest, map } = props
      const query = joinPathWithRest(path, rest)
      const facets = `${query}?map=${map}`
      return ({
        variables: { facets },
      })
    },
  }),
  graphql(searchQuery, { name: 'searchQuery',
    options: (props) => {
      const { path, rest, map } = props
      const query = joinPathWithRest(path, rest)
      const orderBy = props.orderBy
      const from = (props.page - 1) * props.maxItemsPerPage
      const to = from + props.maxItemsPerPage - 1
      return {
        variables: { query, map, orderBy, from, to },
      }
    },
  }),
)(SearchResultContainer)

SearchResultContainer.propTypes = SearchResultContainerWithData.propTypes = {
  /** Internal route path. e.g: 'store/search' */
  pagesPath: PropTypes.string,
  /** Path param. e.g: eletronics/smartphones */
  path: PropTypes.string,
  /** Map param. e.g: c,c */
  map: mapType.isRequired,
  /** Rest param. e.g: Android,Samsung */
  rest: mapType.isRequired,
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

SearchResultContainer.defaultProps = SearchResultContainerWithData.defaultProps = {
  orderBy: SortOptions[0].value,
  rest: '',
}

export default SearchResultContainerWithData
