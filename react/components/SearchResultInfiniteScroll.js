import React, { Component } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Spinner } from 'vtex.styleguide'

import { searchResultPropTypes } from '../constants/propTypes'
import { findInTree, getCategoriesFromQuery, getPagesArgs, mountOptions } from '../constants/SearchHelpers'
import Gallery from './Gallery'
import SearchFilter from './SearchFilter'
import SearchHeader from './SearchHeader'
import SelectedFilters from './SelectedFilters'

const CATEGORIES_FILTER_TITLE = 'search.filter.title.categories'
const CATEGORIES_FILTER_TYPE = 'Categories'

/**
 * Search Result Component.
 */
export default class SearchResultInfiniteScroll extends Component {
  static propTypes = searchResultPropTypes

  getLinkProps = ({ opt, type, isSelected, ordenation, pageNumber }) => {
    const { rest, map, pagesPath, params } = this.props
    let {
      variables: { orderBy },
    } = this.props.searchQuery
    orderBy = ordenation || orderBy
    return getPagesArgs(
      { name: opt && opt.Name, type, link: opt && opt.Link },
      rest,
      { map, orderBy, pageNumber },
      pagesPath,
      params,
      isSelected
    )
  }

  getCategories() {
    const {
      searchQuery: {
        facets,
        variables: { query, map },
      },
    } = this.props
    const { CategoriesTrees: tree } = facets

    if (!tree || tree.length === 0) {
      return []
    }

    const [{ Children: children }] = tree
    const categories = getCategoriesFromQuery(query, map)
    const category = findInTree(tree, categories, 0)
    if (category) {
      return category.Children || children
    }
    return children || []
  }

  getSelecteds() {
    const {
      searchQuery: {
        facets: {
          Brands = [],
          SpecificationFilters = [],
          PriceRanges = [],
        },
        variables: { query, map, rest },
      },
    } = this.props
    const categories = this.getCategories()
    let options = []
    options = options.concat(mountOptions(categories, CATEGORIES_FILTER_TYPE, query, map, rest))
    SpecificationFilters.map(spec => {
      options = options.concat(mountOptions(spec.facets, 'SpecificationFilters', query, map, rest))
    })
    options = options.concat(mountOptions(Brands, 'Brands', query, map, rest))
    options = options.concat(mountOptions(PriceRanges, 'PriceRanges', query, map, rest))
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
        variables: { query, map, rest },
      },
    } = this.props
    const categories = this.getCategories()
    const filtersFallback = (type, title, options, oneSelectedCollapse = false) => {
      return (
        <SearchFilter
          key={title}
          title={title}
          options={mountOptions(options, type, query, map, rest)}
          oneSelectedCollapse={oneSelectedCollapse}
          type={type}
          getLinkProps={this.getLinkProps}
        />
      )
    }
    const filters = []
    if (categories.length) {
      filters.push(filtersFallback(CATEGORIES_FILTER_TYPE, CATEGORIES_FILTER_TITLE, categories, true))
    }
    SpecificationFilters.map(spec => {
      filters.push(filtersFallback('SpecificationFilters', spec.name, spec.facets))
    })
    filters.push(filtersFallback('Brands', 'Brands', Brands))
    filters.push(filtersFallback('PriceRanges', 'Price Ranges', PriceRanges))
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
        variables: { query, map, orderBy },
        loading: searchLoading,
        fetchMore,
      },
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
              selecteds={selecteds || []}
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
