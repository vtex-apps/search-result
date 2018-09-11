import React, { Component } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { FormattedMessage } from 'react-intl'
import { ExtensionPoint } from 'render'

import Gallery from '../Gallery'
import OrderBy from '../OrderBy'
import FiltersContainer from '../FiltersContainer'

/**
 * Search Result Component.
 */
export default class InfiniteScrollLoaderResult extends Component {
  render() {
    const {
      loading,
      to,
      onSetFetchMoreLoading,
      maxItemsPerPage,
      products,
      fetchMore,
      onFetchMoreProducts,
      recordsFiltered,
      breadcrumbsProps,
      brands,
      getLinkProps,
      map,
      params,
      priceRange,
      priceRanges,
      rest,
      specificationFilters,
      tree,
      fetchMoreLoading,
      renderSpinner,
      orderBy,
      summary
    } = this.props

    return (
      <InfiniteScroll
        dataLength={products.length}
        next={() => {
          onSetFetchMoreLoading(true)

          return fetchMore({
            variables: {
              from: to,
              to: to + maxItemsPerPage - 1,
            },
            updateQuery: onFetchMoreProducts,
          })
        }}
        hasMore={products.length < recordsFiltered}
      >
        <div className="vtex-search-result vtex-search-result--infinite-scroll pv5 ph9-l ph7-m ph5-s">
          <div className="vtex-search-result__breadcrumb">
            <ExtensionPoint id="breadcrumb" {...breadcrumbsProps} />
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
              brands={brands}
              getLinkProps={getLinkProps}
              map={map}
              params={params}
              priceRange={priceRange}
              priceRanges={priceRanges}
              rest={rest}
              specificationFilters={specificationFilters}
              tree={tree}
              loading={loading && !fetchMoreLoading}
            />
          </div>
          <div className="vtex-search-result__border" />
          <div className="vtex-search-result__order-by">
            <OrderBy
              orderBy={orderBy}
              getLinkProps={getLinkProps}
            />
          </div>
          <div className="vtex-search-result__gallery">
            {loading && !fetchMoreLoading ? (
              renderSpinner()
            ) : (
                <Gallery products={products} summary={summary} />
              )}
            {fetchMoreLoading && renderSpinner()}
          </div>
        </div>
      </InfiniteScroll>
    )
  }
}
