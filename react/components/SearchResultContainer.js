import React, { Component } from 'react'
import QueryString from 'query-string'
import { min } from 'ramda'

import { Container } from 'vtex.store-components'

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
    maxItemsPerPage: 10,
  }

  state = {
    fetchMoreLoading: false,
  }

  _fetchMoreLocked = false

  get breadcrumbsProps() {
    const {
      params: { category, department, term },
      searchQuery: { facets },
    } = this.props

    const categoriesTrees = facets ? facets.CategoriesTrees : []

    const categoryReducer = (acc, category) => [...acc, `/${category.Name}`]

    const categoryWithChildrenReducer = (acc, category) => [
      ...acc,
      `/${category.Name}`,
      ...category.Children.map(
        children => `/${category.Name}/${children.Name}`
      ),
    ]

    const getCategoryList = (reducer, initial = []) =>
      categoriesTrees.reduce(reducer, initial)

    const categories =
      department && category
        ? getCategoryList(categoryWithChildrenReducer)
        : department
        ? getCategoryList(categoryReducer)
        : []

    return {
      term: term ? decodeURIComponent(term) : term,
      categories,
    }
  }

  getLinkProps = (spec, useEmptyMap = false) => {
    const { map, pagesPath, params } = this.props
    const filters = Array.isArray(spec) ? spec : [spec]

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
          map:
            (map &&
              (useEmptyMap
                ? getBaseMap(map)
                    .split(',')
                    .filter(x => x)
                : map.split(','))) ||
            [],
        },
      }
    )

    const queryString = QueryString.stringify({
      ...pageProps.query,
      map: pageProps.query.map && pageProps.query.map.join(','),
    })

    return {
      page: pagesPath,
      queryString: queryString,
      params: pageProps.params,
    }
  }

  handleFetchMore = () => {
    if (this._fetchMoreLocked) {
      return
    }

    this._fetchMoreLocked = true

    const {
      maxItemsPerPage,
      searchQuery: { products, recordsFiltered },
    } = this.props

    const to = min(maxItemsPerPage + products.length, recordsFiltered) - 1

    this.setState({
      fetchMoreLoading: true,
    })

    this.props.searchQuery.fetchMore({
      variables: {
        from: products.length,
        to,
      },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        this.setState(
          {
            fetchMoreLoading: false,
          },
          () => {
            this._fetchMoreLocked = false
          }
        )

        // backwards compatibility
        if (prevResult.search) {
          return {
            search: {
              ...prevResult.search,
              products: [
                ...prevResult.search.products,
                ...fetchMoreResult.search.products,
              ],
            }
          }
        }

        return {
          ...prevResult,
          products: [
            ...prevResult.products,
            ...fetchMoreResult.products,
          ],
        }
      },
    })
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
        variables: { query },
      },
      pagination,
    } = this.props

    const ResultComponent =
      pagination === PAGINATION_TYPES[0]
        ? ShowMoreLoaderResult
        : InfiniteScrollLoaderResult

    return (
      <Container className="pt3-m pt5-l">
        <PopupProvider>
          <div id="search-result-anchor" />
          <ResultComponent
            {...this.props}
            breadcrumbsProps={this.breadcrumbsProps}
            getLinkProps={this.getLinkProps}
            onFetchMore={this.handleFetchMore}
            fetchMoreLoading={this.state.fetchMoreLoading}
            query={query}
            loading={loading}
            recordsFiltered={recordsFiltered}
            products={products}
            brands={Brands}
            specificationFilters={SpecificationFilters}
            priceRanges={PriceRanges}
            tree={CategoriesTrees}
          />
        </PopupProvider>
      </Container>
    )
  }
}
