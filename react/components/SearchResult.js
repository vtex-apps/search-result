import React, { Component } from 'react'
import { Spinner } from 'vtex.styleguide'
import { ExtensionPoint } from 'render'

import { searchResultPropTypes } from '../constants/propTypes'
import { PopupProvider } from './Popup'
import InfiniteScrollLoaderResult from './loaders/InfiniteScrollLoaderResult'

/**
 * Search Result Component.
 */
export default class SearchResult extends Component {
  static propTypes = searchResultPropTypes

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
      onSetFetchMoreLoading,
      breadcrumbsProps,
      getLinkProps,
      fetchMoreLoading,
    } = this.props

    const isLoading = loading || this.props.loading
    const to = (page - 1) * maxItemsPerPage + products.length

    return (
      <PopupProvider>
        <InfiniteScrollLoaderResult
          loading={isLoading}
          to={to}
          renderSpinner={this.renderSpinner}
          onSetFetchMoreLoading={onSetFetchMoreLoading}
          maxItemsPerPage={maxItemsPerPage}
          products={products}
          fetchMore={fetchMore}
          recordsFiltered={recordsFiltered}
          breadcrumbsProps={breadcrumbsProps}
          brands={Brands}
          getLinkProps={getLinkProps}
          map={map}
          params={params}
          priceRange={priceRange}
          priceRanges={PriceRanges}
          rest={rest}
          specificationFilters={SpecificationFilters}
          tree={CategoriesTrees}
          fetchMoreLoading={fetchMoreLoading}
          orderBy={orderBy}
          summary={summary}
        />
      </PopupProvider>
    )
  }
}
