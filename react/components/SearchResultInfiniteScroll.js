import React, { Component } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Spinner } from 'vtex.styleguide'

import { searchResultPropTypes } from '../constants/propTypes'
import { findInTree, getPagesArgs, mountOptions } from '../constants/SearchHelpers'
import Gallery from './Gallery'
import SearchFilter from './SearchFilter'
import SearchHeader from './SearchHeader'
import SelectedFilters from './SelectedFilters'

const CATEGORIES_TITLE = 'search.filter.title.categories'
const CATEGORIES_TYPE = 'Categories'
const BRANDS_TITLE = 'search.filter.title.brands'
const BRANDS_TYPE = 'Brands'
const PRICE_RANGES_TITLE = 'search.filter.title.price-ranges'
const PRICE_RANGES_TYPE = 'PriceRanges'
const SPECIFICATION_FILTERS_TYPE = 'SpecificationFilters'

/**
 * Search Result Component.
 */
export default class SearchResultInfiniteScroll extends Component {
  static propTypes = searchResultPropTypes

  getLinkProps = ({ link, type, ordenation, pageNumber, isSelected }) => {
    const { rest, map, pagesPath, params } = this.props
    const orderBy = ordenation || this.props.orderBy
    return getPagesArgs({
      type,
      link,
      rest,
      map,
      orderBy,
      pageNumber,
      isUnselectLink: isSelected,
      pagesPath,
      params,
    })
  }

  getCategories() {
    const { searchQuery: { facets: { CategoriesTrees: tree } }, params } = this.props
    if (!tree || tree.length === 0) {
      return []
    }
    const [{ Children: children }] = tree
    const categories = Object.values(params).filter(category => !!category)
    const category = findInTree(tree, categories, 0)
    if (category) {
      return category.Children || children
    }
    return children || []
  }

  filtersFallback = (type, title, options, oneSelectedCollapse = false) => {
    const { map, rest } = this.props
    return (
      <SearchFilter
        key={title}
        title={title}
        options={mountOptions(options, type, map, rest)}
        oneSelectedCollapse={oneSelectedCollapse}
        type={type}
        getLinkProps={this.getLinkProps}
      />
    )
  }

  getSelecteds() {
    const {
      searchQuery: {
        facets: {
          Brands = [],
          SpecificationFilters = [],
          PriceRanges = [],
        },
      },
      map,
      rest,
    } = this.props
    const categories = this.getCategories()
    let options = []
    options = options.concat(mountOptions(categories, CATEGORIES_TYPE, map, rest))
    SpecificationFilters.map(spec => {
      options = options.concat(mountOptions(spec.facets, SPECIFICATION_FILTERS_TYPE, map, rest))
    })
    options = options.concat(mountOptions(Brands, BRANDS_TYPE, map, rest))
    options = options.concat(mountOptions(PriceRanges, PRICE_RANGES_TYPE, map, rest))
    return options.filter(opt => opt.selected)
  }

  renderSearchFilters() {
    const {
      searchQuery: {
        facets: {
          Brands = [],
          SpecificationFilters = [],
          PriceRanges = [],
        },
      },
    } = this.props
    const categories = this.getCategories()
    const filters = []
    if (categories.length) {
      filters.push(this.filtersFallback(CATEGORIES_TYPE, CATEGORIES_TITLE, categories, true))
    }
    SpecificationFilters.map(spec => {
      filters.push(this.filtersFallback(SPECIFICATION_FILTERS_TYPE, spec.name, spec.facets))
    })
    filters.push(this.filtersFallback(BRANDS_TYPE, BRANDS_TITLE, Brands))
    filters.push(this.filtersFallback(PRICE_RANGES_TYPE, PRICE_RANGES_TITLE, PriceRanges))
    return filters
  }

  handleFetchMoreProducts = (prev, { fetchMoreResult }) => {
    this.fetchMoreLoading = false
    if (!fetchMoreResult) return prev
    return {
      search: {
        ...prev.search,
        products: [...prev.search.products, ...fetchMoreResult.search.products],
      },
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
      searchQuery: {
        products = [],
        recordsFiltered = 0,
        loading: searchLoading,
        fetchMore,
      },
      orderBy,
      maxItemsPerLine,
      maxItemsPerPage,
      page,
      summary,
    } = this.props

    const isLoading = searchLoading || this.props.loading
    const from = (page - 1) * maxItemsPerPage + 1
    const to = (page - 1) * maxItemsPerPage + products.length
    const selecteds = this.getSelecteds()

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
        hasMore={products.length < recordsFiltered}
      >
        <div className="vtex-search-result w-100 pa3 dib">
          <div className="w-100 w-30-m w-20-l fl pa3">
            <SelectedFilters
              selecteds={selecteds}
              getLinkProps={this.getLinkProps}
            />
            {this.renderSearchFilters()}
          </div>
          <div className="w-100 w-70-m w-80-l fl">
            <SearchHeader
              {...{ from, to, orderBy, recordsFiltered }}
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
