import React, { Component } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Spinner } from 'vtex.styleguide'

import VTEXClasses from '../constants/CSSClasses'
import { searchResultPropTypes } from '../constants/propTypes'
import { findInTree, getCategoriesFromQuery, getPagesArgs, stripPath } from '../constants/SearchHelpers'
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
export default class SearchResultInfiniteScroll extends Component {
  static propTypes = searchResultPropTypes

  getLinkProps = ({ opt, type, isSelected, ordenation, pageNumber }) => {
    const { path, rest, map, pagesPath } = this.props
    let {
      variables: { orderBy },
    } = this.props.searchQuery
    orderBy = ordenation || orderBy
    return getPagesArgs(
      { name: opt && opt.Name, type, link: opt && opt.Link },
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
      searchQuery: {
        variables: { query, map },
      },
      pagesPath,
    } = this.props
    const { CategoriesTrees: tree } = facetsQuery.facets
    const [{ Children: children }] = tree
    const categories = getCategoriesFromQuery(query, map)
    const category = findInTree(tree, categories, 0)
    if (pagesPath === 'store/department') {
      return children
    } else if (category) {
      return category.Children || children
    }
  }

  renderSearchFilters() {
    if (!this.props.facetsQuery || !this.props.facetsQuery.facets) return

    const {
      facetsQuery: { facets: facetsProps },
    } = this.props
    const facets = { ...facetsProps }
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
      const [{ Quantity: quantity }] = facetsQuery.facets.Departments
      return quantity
    }
    return (searchQuery.products && searchQuery.products.length) || 0
  }

  handleFetchMoreProducts = (prev, { fetchMoreResult }) => {
    this.fetchMoreLoading = false
    if (!fetchMoreResult) return prev
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
      facetsQuery: { loading: facetsLoading },
      searchQuery: {
        products: searchedProducts,
        variables: { query, map, orderBy },
        loading: searchLoading,
        fetchMore,
      },
      maxItemsPerLine,
      maxItemsPerPage,
      page,
      summary,
    } = this.props
    const isLoading = searchLoading || facetsLoading
    const products = searchedProducts || []
    const from = (page - 1) * maxItemsPerPage + 1
    const to = (page - 1) * maxItemsPerPage + products.length
    const selecteds = this.getSelecteds()
    const recordsFiltered = this.getRecordsFiltered()

    return (
      <InfiniteScroll
        dataLength={products.length}
        next={() => {
          this.fetchMoreLoading = true
          return fetchMore({
            variables: {
              from: to,
              to: to + maxItemsPerPage - 1,
            },
            updateQuery: this.handleFetchMoreProducts,
          })
        }}
        hasMore={products.length < recordsFiltered}>
        <div className={`${VTEXClasses.MAIN_CLASS} w-100 pa3 dib`}>
          <div className="w-100 w-30-m w-20-l fl pa3">
            <SelectedFilters
              selecteds={selecteds}
              getLinkProps={this.getLinkProps}
            />
            {this.renderSearchFilters()}
          </div>
          <div className="w-100 w-70-m w-80-l fl">
            <SearchHeader
              {...{ from, to, query, map, orderBy, recordsFiltered }}
              getLinkProps={this.getLinkProps}
            />
            {isLoading && !this.fetchMoreLoading ? (
              this.renderSpinner()
            ) : (
              <Gallery {...{ products, maxItemsPerLine, summary }} />
            )}
            {this.fetchMoreLoading && this.renderSpinner()}
          </div>
        </div>
      </InfiniteScroll>
    )
  }
}
