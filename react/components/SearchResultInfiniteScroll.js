import React, { Component } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Spinner } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'

import { searchResultPropTypes } from '../constants/propTypes'
import { findInTree, getPagesArgs, mountOptions } from '../constants/SearchHelpers'
import Gallery from './Gallery'
import OrderBy from './OrderBy'
import SearchFilter from './SearchFilter'
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

  state = {
    fetchMoreLoading: false,
  }

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
    const categories = Object.values(params).filter(category => category)
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
    this.setState({
      fetchMoreLoading: false,
    })

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
      maxItemsPerPage,
      page,
      summary,
    } = this.props

    const isLoading = searchLoading || this.props.loading
    // const from = (page - 1) * maxItemsPerPage + 1
    const to = (page - 1) * maxItemsPerPage + products.length
    const selecteds = this.getSelecteds()

    return (
      <InfiniteScroll
        dataLength={products.length}
        next={() => {
          this.setState({
            fetchMoreLoading: true,
          })

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
        <div className="vtex-search-result vtex-search-result--infinite-scroll pv3 ph9-l ph7-m ph5-s">
          <div className="vtex-search-result__breadcrumb">
            {/* <ExtensionPoint id="breadcrumb" /> */}
          </div>
          <div className="vtex-search-result__total-products">
            <FormattedMessage
              id="search.total-products"
              values={{ recordsFiltered }}
            >
              {txt => <span className="ph4 black-50">{txt}</span>}
            </FormattedMessage>
          </div>
          <div className="vtex-search-result__order-by">
            <OrderBy
              orderBy={orderBy}
              getLinkProps={this.getLinkProps}
            />
          </div>
          <div className="vtex-search-result__filters pa3">
            <SelectedFilters
              selecteds={selecteds}
              getLinkProps={this.getLinkProps}
            />
            {this.renderSearchFilters()}
          </div>
          <div className="vtex-search-result__gallery">
            {isLoading && !this.state.fetchMoreLoading ? (
              this.renderSpinner()
            ) : (
              <Gallery products={products} summary={summary} />
            )}
            {this.state.fetchMoreLoading && this.renderSpinner()}
          </div>
        </div>
      </InfiniteScroll>
    )
  }
}
