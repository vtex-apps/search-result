import React, { Component } from 'react'
import { Spinner } from 'vtex.styleguide'
import { ExtensionPoint } from 'render'
import { FormattedMessage } from 'react-intl'

import FiltersContainer from './FiltersContainer'
import { searchResultPropTypes } from '../constants/propTypes'
import { PopupProvider } from './Popup'
import OrderBy from './OrderBy'
import Gallery from './Gallery'

import InfiniteScrollLoaderResult from './loaders/InfiniteScrollLoaderResult'
import ShowMoreLoaderResult from './loaders/ShowMoreLoaderResult'

/**
 * Search Result Component.
 */
export default class SearchResult extends Component {
  renderSpinner = () => {
    return (
      <div className="w-100 flex justify-center">
        <div className="w3 ma0">
          <Spinner />
        </div>
      </div>
    )
  }

  renderBreadcrumb = () => {
    const { breadcrumbsProps } = this.props

    return (
      <div className="vtex-search-result__breadcrumb">
        <ExtensionPoint id="breadcrumb" {...breadcrumbsProps} />
      </div>
    )
  }

  renderTotalProducts = () => {
    const { recordsFiltered } = this.props

    return (
      <div className="vtex-search-result__total-products">
        <FormattedMessage
          id="search.total-products"
          values={{ recordsFiltered }}
        >
          {txt => <span className="ph4 black-50">{txt}</span>}
        </FormattedMessage>
      </div>
    )
  }

  renderFilters = () => {
    const {
      brands, getLinkProps, map, params, priceRange,
      priceRanges, rest, specificationFilters, tree,
      loading, fetchMoreLoading
    } = this.props

    return (
      <div className="vtex-search-result__filters">
        <ExtensionPoint
          id="filters"
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
    )
  }

  renderOrderBy = () => {
    const { orderBy, getLinkProps } = this.props

    return (
      <div className="vtex-search-result__order-by">
        <ExtensionPoint
          id="order-by"
          orderBy={orderBy}
          getLinkProps={getLinkProps}
        />
      </div>
    )
  }

  renderGallery = () => {
    const { loading, fetchMoreLoading, products, summary } = this.props

    return (
      <div className="vtex-search-result__gallery">
        {loading && !fetchMoreLoading ? (
          this.renderSpinner()
        ) : (
            <ExtensionPoint
              id="gallery"
              products={products}
              summary={summary}
            />
          )}
      </div>
    )
  }

  render() {
    const {
      to,
      onSetFetchMoreLoading,
      maxItemsPerPage,
      products,
      fetchMore,
      onFetchMoreProducts,
      recordsFiltered,
      fetchMoreLoading,
      loading
    } = this.props

    console.log('SearchResult')
    return (
      <PopupProvider>
        <ExtensionPoint
          id="result-loader"
          renderSpinner={this.renderSpinner}
          renderFilters={this.renderFilters}
          renderBreadcrumb={this.renderBreadcrumb}
          renderTotalProducts={this.renderTotalProducts}
          renderOrderBy={this.renderOrderBy}
          renderGallery={this.renderGallery}
          to={to}
          onSetFetchMoreLoading={onSetFetchMoreLoading}
          maxItemsPerPage={maxItemsPerPage}
          productsLength={products.length}
          fetchMore={fetchMore}
          onFetchMoreProducts={onFetchMoreProducts}
          recordsFiltered={recordsFiltered}
          fetchMoreLoading={fetchMoreLoading}
          loading={loading}
        />
      </PopupProvider>
    )
  }
}

SearchResult.propTypes = searchResultPropTypes
