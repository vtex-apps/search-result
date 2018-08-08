import React, { Component } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Spinner } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'
import QueryString from 'query-string'

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

  getLinkProps = (spec, useEmptyMapAndRest = false) => {
    const { rest, map, pagesPath, params } = this.props
    const filters = Array.isArray(spec) ? spec : [spec]

    if (filters.length === 0) {
      return {
        page: pagesPath,
        params,
      }
    }

    const pageProps = filters.reduce(
      (linkProps, filter) => {
        const { link, type, ordenation, pageNumber, isSelected } = filter
        const orderBy = ordenation || this.props.orderBy

        return getPagesArgs({
          rest: linkProps.query.rest,
          map: linkProps.query.map,
          pagesPath: linkProps.page,
          params: linkProps.params,
          type,
          link,
          orderBy,
          pageNumber,
          isUnselectLink: isSelected,
        })
      },
      {
        page: pagesPath,
        params,
        query: {
          map: useEmptyMapAndRest
            ? getBaseMap(map, rest).split(',').filter(x => x)
            : map.split(','),
          rest: useEmptyMapAndRest ? [] : rest.split(','),
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

    const isLoading = products.length === 0 && (searchLoading || this.props.loading)
    // const from = (page - 1) * maxItemsPerPage + 1
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
