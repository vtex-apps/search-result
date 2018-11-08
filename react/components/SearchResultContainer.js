import React, { Component } from 'react'
import QueryString from 'query-string'

import { PopupProvider } from './Popup'
import InfiniteScrollLoaderResult from './loaders/InfiniteScrollLoaderResult'
import ShowMoreLoaderResult from './loaders/ShowMoreLoaderResult'
import { getPagesArgs, getBaseMap } from '../constants/SearchHelpers'
import { searchResultContainerPropTypes } from '../constants/propTypes'

const PAGINATION_TYPES = ['show-more', 'infinite-scroll']

/**
 * Search Result Container Component.
 */
export default class SearchResultContainer extends Component {
  static propTypes = searchResultContainerPropTypes

  static defaultProps = {
    showMore: false,
  }

  state = {
    fetchMoreLoading: false,
  }

  get breadcrumbsProps() {
    const {
      params: { category, department, term },
    } = this.props

    const categories = []

    if (department) {
      categories.push(decodeURIComponent(department))
    }

    if (category) {
      categories.push(
        `${decodeURIComponent(department)}/${decodeURIComponent(category)}/`
      )
    }

    return {
      term: term ? decodeURIComponent(term) : term,
      categories,
    }
  }

  getLinkProps = (spec, useEmptyMapAndRest = false) => {
    const { rest, map, pagesPath, params } = this.props
    const filters = Array.isArray(spec) ? spec : [spec]
    const maps = Array.isArray(map) ? map : [map]


    if (filters.length === 0) {
      return {
        page: pagesPath,
        params,
      }
    }

    const pageProps = filters.reduce(
      (linkProps, filter) => {
        const {
          type,
          ordenation,
          pageNumber,
          isSelected,
          path,
          name,
          link,
          slug,
        } = filter
        const order = ordenation || linkProps.query.order

        return getPagesArgs({
          ...linkProps,
          query: {
            ...linkProps.query,
            order,
          },
          pagesPath: linkProps.page,
          name,
          slug: slug,
          link,
          path,
          type,
          pageNumber,
          isUnselectLink: isSelected,
        })
      },
      {
        page: pagesPath,
        params,
        query: {
          order: this.props.orderBy,
          map: useEmptyMapAndRest
            ? getBaseMap(maps, rest)
                .split(',')
                .filter(x => x)
            : maps,
          rest: useEmptyMapAndRest ? [] : rest.split(',').filter(x => x),
        },
      }
    )

    const queryString = QueryString.stringify({
      ...pageProps.query,
      map: pageProps.query.map.join(','),
      rest: pageProps.query.rest.join(',') || undefined,
    })

    return {
      page: pageProps.page,
      queryString: queryString,
      params: pageProps.params,
    }
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

  handleSetFetchMoreLoading = fetchMoreLoading => {
    this.setState({ fetchMoreLoading })
  }

  render() {
    const {
      searchQuery: {
        facets: {
          Brands = [],
          SpecificationFilters = [],
          PriceRanges = [],
          CategoriesTrees,
        } = {},
        products = [],
        recordsFiltered = 0,
        loading,
        fetchMore,
      },
      orderBy,
      maxItemsPerPage,
      page,
      summary,
      map,
      rest,
      params,
      priceRange,
      pagination,
      hiddenFacets,
    } = this.props

    const breadcrumbsProps = this.breadcrumbsProps
    const to = (page - 1) * maxItemsPerPage + products.length

    const props = {
      breadcrumbsProps,
      onSetFetchMoreLoading: this.handleSetFetchMoreLoading,
      onFetchMoreProducts: this.handleFetchMoreProducts,
      getLinkProps: this.getLinkProps,
      fetchMoreLoading: this.state.fetchMoreLoading,
      orderBy,
      maxItemsPerPage,
      page,
      summary,
      map,
      rest,
      params,
      fetchMore,
      to,
      loading,
      recordsFiltered,
      products,
      brands: Brands,
      specificationFilters: SpecificationFilters,
      priceRanges: PriceRanges,
      priceRange: priceRange,
      hiddenFacets,
      tree: CategoriesTrees,
    }

    return (
      <PopupProvider>
        {pagination === PAGINATION_TYPES[0] ? (
          <ShowMoreLoaderResult {...props} />
        ) : (
          <InfiniteScrollLoaderResult {...props} />
        )}
      </PopupProvider>
    )
  }
}
