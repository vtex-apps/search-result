import React, { Component } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Spinner } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'

import { searchResultPropTypes } from '../constants/propTypes'
import Gallery from './Gallery'
import OrderBy from './OrderBy'
import FiltersContainer from './FiltersContainer'

/**
 * Search Result Component.
 */
export default class SearchResultInfiniteScroll extends Component {
  static propTypes = searchResultPropTypes

  state = {
    fetchMoreLoading: false,
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
      pagesPath,
      params,
    } = this.props

    const isLoading = products.length === 0 && (searchLoading || this.props.loading)
    // const from = (page - 1) * maxItemsPerPage + 1
    const to = (page - 1) * maxItemsPerPage + products.length

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
            <FiltersContainer
              brands={Brands}
              map={map}
              orderBy={orderBy}
              pagesPath={pagesPath}
              params={params}
              priceRanges={PriceRanges}
              rest={rest}
              specificationFilters={SpecificationFilters}
              tree={CategoriesTrees}
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
    )
  }
}
