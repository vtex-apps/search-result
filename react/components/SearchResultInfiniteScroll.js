import React, { Component } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Spinner } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'
import QueryString from 'query-string'
import { ExtensionPoint } from 'render'

import { getPagesArgs, getBaseMap } from '../constants/SearchHelpers'
import { searchResultPropTypes } from '../constants/propTypes'
import Gallery from './Gallery'
import OrderBy from './OrderBy'
import FiltersContainer from './FiltersContainer'
import { PopupProvider } from './Popup'

/**
 * Search Result Component.
 */
export default class SearchResultInfiniteScroll extends Component {
  static propTypes = searchResultPropTypes

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
        const { type, ordenation, pageNumber, isSelected, path, name } = filter
        const orderBy = ordenation || linkProps.query.order

        return getPagesArgs({
          rest: linkProps.query.rest,
          map: linkProps.query.map,
          pagesPath: linkProps.page,
          params: linkProps.params,
          name,
          path,
          type,
          orderBy,
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
        facets: {
          Brands = [],
          SpecificationFilters = [],
          PriceRanges = [],
          CategoriesTrees,
        } = {},
        products = [],
        recordsFiltered = 0,
        loading: searchLoading,
        fetchMore,
      },
      orderBy,
      maxItemsPerPage,
      page,
      summary,
      map,
      rest,
      params,
    } = this.props

    const isLoading = searchLoading || this.props.loading
    const to = (page - 1) * maxItemsPerPage + products.length

    return (
      <PopupProvider>
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
              <ExtensionPoint id="breadcrumb" {...this.breadcrumbsProps} />
            </div>
            <div className="vtex-search-result__total-products">
              <FormattedMessage
                id="search.total-products"
                values={{ recordsFiltered }}
              >
                {txt => <span className="ph4 black-50">{txt}</span>}
              </FormattedMessage>
            </div>
            <div className="vtex-search-result__filters">
              <FiltersContainer
                brands={Brands}
                getLinkProps={this.getLinkProps}
                map={map}
                params={params}
                priceRanges={PriceRanges}
                rest={rest}
                specificationFilters={SpecificationFilters}
                tree={CategoriesTrees}
              />
            </div>
            <div className="vtex-search-result__border" />
            <div className="vtex-search-result__order-by">
              <OrderBy
                orderBy={orderBy}
                getLinkProps={this.getLinkProps}
              />
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
      </PopupProvider>
    )
  }
}
