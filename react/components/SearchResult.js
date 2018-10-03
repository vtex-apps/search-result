import React, { Component } from 'react'
import { Spinner } from 'vtex.styleguide'
import { ExtensionPoint } from 'render'
import { FormattedMessage } from 'react-intl'

import LayoutModeSwitcher from './LayoutModeSwitcher'
import { searchResultPropTypes } from '../constants/propTypes'
import OrderBy from './OrderBy'

/**
 * Search Result Component.
 */
export default class SearchResult extends Component {
  static propTypes = searchResultPropTypes

  state = {
    galleryLayoutMode: 'normal',
  }

  handleLayoutChange = (e, mode) => {
    e.preventDefault()

    this.setState({
      galleryLayoutMode: mode,
    })
  }

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

    const term = params && params.term

    return (
      <div className="vtex-search-result vtex-page-padding pv5 ph9-l ph7-m ph5-s">
        <div className="vtex-search-result__breadcrumb db-ns dn-s">
          <ExtensionPoint id="breadcrumb" {...breadcrumbsProps} />
        </div>
        <div className="vtex-search-result__total-products bn-ns bb-s b--muted-4 tc-s tl">
          <span className="fw4 mt1 mb1 dn-ns db-s f4">
            {term}
          </span>
          <FormattedMessage
            id="search.total-products"
            values={{ recordsFiltered }}
          >
            {txt => <span className="ph4 c-muted-2">{txt}</span>}
          </FormattedMessage>
        </div>
        <div className="vtex-search-result__filters">
          <ExtensionPoint
            id="filter-navigator"
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
        <div className="vtex-search-result__border bg-muted-4 h-75 self-center" />
        <div className="vtex-search-result__order-by">
          <OrderBy
            orderBy={orderBy}
            getLinkProps={getLinkProps}
          />
        </div>
        <div className="vtex-search-result__gallery">
          <div className="dn-ns db-s bt b--muted-4">
            <LayoutModeSwitcher
              activeMode={this.state.galleryLayoutMode}
              onChange={this.handleLayoutChange}
            />
          </div>
          {loading && !fetchMoreLoading ? (
            <div className="w-100 flex justify-center">
              <div className="w3 ma0">
                <Spinner />
              </div>
            </div>
          ) : (
            <ExtensionPoint
              id="gallery"
              products={products}
              summary={summary}
              layoutMode={this.state.galleryLayoutMode}
            />
          )}
          {children}
        </div>
      </div>
    )
  }
}
