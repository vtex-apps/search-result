import './global.css'

import React, { Component } from 'react'
import QueryString from 'query-string'
import ProductSummary from 'vtex.product-summary/index'

import { SORT_OPTIONS } from './components/OrderBy'
import { PopupProvider } from './components/Popup'
import { getPagesArgs, getBaseMap } from './constants/SearchHelpers'
import InfiniteScrollLoaderResult from './components/loaders/InfiniteScrollLoaderResult'
import ShowMoreLoaderResult from './components/loaders/ShowMoreLoaderResult'
import { searchResultContainerPropTypes } from './constants/propTypes'

const PAGINATION_TYPES = ['show-more', 'infinite-scroll']

/**
 * Search Result Container Component.
 */
export default class SearchResultContainer extends Component {
  state = {
    fetchMoreLoading: false,
  }

  get breadcrumbsProps() {
    const {
      params: { category, department, term },
    } = this.props

    const categories = []

    if (department) {
      categories.push(department)
    }

    if (category) {
      categories.push(`${department}/${category}/`)
    }

    return {
      term,
      categories,
    }
  }

  getLinkProps = (spec, useEmptyMapAndRest = false) => {
    const {
      rest,
      map,
      pagesPath,
      params,
    } = this.props
    const filters = Array.isArray(spec) ? spec : [spec]

    if (filters.length === 0) {
      return {
        page: pagesPath,
        params,
      }
    }

    const pageProps = filters.reduce(
      (linkProps, filter) => {
        const { type, ordenation, pageNumber, isSelected, path, name, link, slug } = filter
        const order = ordenation || linkProps.query.order

        return getPagesArgs({
          ...linkProps,
          query: {
            ...linkProps.query,
            order,
          },
          pagesPath: linkProps.page,
          name,
          slug: slug || name,
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
            ? getBaseMap(map, rest).split(',').filter(x => x)
            : map.split(','),
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

  handleSetFetchMoreLoading = (fetchMoreLoading) => {
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

SearchResultContainer.propTypes = searchResultContainerPropTypes

SearchResultContainer.defaultProps = {
  showMore: false,
  orderBy: SORT_OPTIONS[0].value,
  rest: '',
}

SearchResultContainer.uiSchema = {
  maxItemsPerLine: {
    'ui:widget': 'radio',
    'ui:options': {
      inline: true,
    },
  },
}

SearchResultContainer.getSchema = props => {
  return {
    title: 'editor.search-result.title',
    description: 'editor.search-result.description',
    type: 'object',
    properties: {
      hiddenFacets: {
        title: 'editor.search-result.hiddenFacets',
        type: 'object',
        isLayout: true,
        properties: {
          brands: {
            title: 'editor.search-result.hiddenFacets.brands',
            type: 'boolean',
            isLayout: true,
          },
          categories: {
            title: 'editor.search-result.hiddenFacets.categories',
            type: 'boolean',
            isLayout: true,
          },
          priceRange: {
            title: 'editor.search-result.hiddenFacets.priceRange',
            type: 'boolean',
            isLayout: true,
          },
          specificationFilters: {
            title: 'editor.search-result.hiddenFacets.specificationFilters',
            type: 'object',
            isLayout: true,
            properties: {
              hideAll: {
                title: 'editor.search-result.hiddenFacets.specificationFilters.hideAll',
                type: 'boolean',
                isLayout: true,
              },
              hiddenFilters: {
                type: 'array',
                isLayout: true,
                items: {
                  title: 'editor.search-result.hiddenFacets.specificationFilters.hiddenFilter',
                  type: 'object',
                  isLayout: true,
                  properties: {
                    name: {
                      title: 'editor.search-result.hiddenFacets.specificationFilters.hiddenFilter.name',
                      type: 'string',
                      isLayout: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
      summary: {
        title: 'editor.search-result.summary.title',
        type: 'object',
        properties: ProductSummary.getSchema(props).properties,
      },
      pagination: {
        type: 'string',
        title: 'editor.search-result.pagination.title',
        default: 'infinity-scroll',
        enum: PAGINATION_TYPES,
        enumNames: [
          'editor.search-result.pagination.show-more',
          'editor.search-result.pagination.infinite-scroll',
        ],
      },
    },
  }
}
