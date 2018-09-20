import React, { Component } from 'react'
import { Spinner } from 'vtex.styleguide'
import { ExtensionPoint } from 'render'
import { FormattedMessage } from 'react-intl'

import FiltersContainer from './FiltersContainer'
import { searchResultPropTypes } from '../constants/propTypes'
import OrderBy from './OrderBy'
import Gallery from './Gallery'

/**
 * Search Result Component.
 */
export default class SearchResult extends Component {
  static propTypes = searchResultPropTypes

  render() {
    const {
      children,
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
      loading,
      fetchMoreLoading,
      products,
      summary,
      orderBy,
      hiddenFacets,
    } = this.props

    return (
      <div className="vtex-search-result vtex-page-padding pv5 ph9-l ph7-m ph5-s">
        <div className="vtex-search-result__breadcrumb db-m dn-s">
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
            hiddenFacets={hiddenFacets}
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
            <div className="w-100 flex justify-center">
              <div className="w3 ma0">
                <Spinner />
              </div>
            </div>
          ) : (
            <Gallery
              products={products}
              summary={summary}
            />
          )}
          {children}
        </div>
      </div>
    )
  }
}
