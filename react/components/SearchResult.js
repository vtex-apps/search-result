import React, { Component, Fragment } from 'react'
import { Spinner } from 'vtex.styleguide'
import { ExtensionPoint } from 'render'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import classNames from 'classnames'

import LoadingOverlay from './LoadingOverlay'
import LayoutModeSwitcher from './LayoutModeSwitcher'
import { searchResultPropTypes } from '../constants/propTypes'
import OrderBy from './OrderBy'
import { withRuntimeContext } from 'render'


/**
 * Search Result Component.
 */
class SearchResult extends Component {
  static propTypes = searchResultPropTypes

  state = {
    galleryLayoutMode: 'normal',
    showLoadingAsOverlay: false,
    // The definitions bellow are required because
    // on SSR the getDerivedStateFromProps isn't called
    products: this.props.products,
    recordsFiltered: this.props.recordsFiltered,
    brands: this.props.brands,
    map: this.props.map,
    params: this.props.params,
    priceRange: this.props.priceRange,
    priceRanges: this.props.priceRanges,
    rest: this.props.rest,
    specificationFilters: this.props.specificationFilters,
    tree: this.props.tree,
    hiddenFacets: this.props.hiddenFacets,
  }

  handleLayoutChange = (e, mode) => {
    e.preventDefault()
    const defaultModes = ['small', 'inline', 'normal']
    const modeIndex = defaultModes.indexOf(this.state.galleryLayoutMode) + 1 
    const currentMode = defaultModes[modeIndex]

    this.setState({
      galleryLayoutMode: currentMode,
    })
  }

  static getDerivedStateFromProps(props) {
    // Do not use the props when the query is loading
    // so we can show the previous products when the
    // overlay is on the screen
    if (!props.loading) {
      const {
        products,
        recordsFiltered,
        brands,
        map,
        params,
        priceRange,
        priceRanges,
        rest,
        specificationFilters,
        tree,
        hiddenFacets,
      } = props

      return {
        products,
        recordsFiltered,
        brands,
        map,
        params,
        priceRange,
        priceRanges,
        rest,
        specificationFilters,
        tree,
        hiddenFacets,
      }
    }

    return null
  }

  componentDidMount() {
    if (!this.props.loading) {
      this.setState({
        showLoadingAsOverlay: true,
      })
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.loading && !this.props.loading) {
      this.setState({
        showLoadingAsOverlay: true,
      })
    }
  }

  render() {
    const {
      children,
      breadcrumbsProps,
      getLinkProps,
      loading,
      fetchMoreLoading,
      summary,
      orderBy,
    } = this.props
    const {
      galleryLayoutMode,
      recordsFiltered,
      products,
      brands,
      map,
      query,
      params,
      priceRange,
      priceRanges,
      rest,
      specificationFilters,
      tree,
      hiddenFacets,
      showLoadingAsOverlay,
    } = this.state

    const mobileMode = __RUNTIME__.hints.mobile
    const term = params && params.term
      ? decodeURIComponent(params.term) : undefined

    if (!products.length && !loading) {
      return (
        <ExtensionPoint id="not-found" term={term} />
      )
    }

    const hideFacets = !map || !map.length
    const showLoading = loading && !fetchMoreLoading
    const showContentLoader = showLoading && !showLoadingAsOverlay
    const filterClasses = classNames({ 'flex justify-center flex-auto pt1 br bl b--muted-4': mobileMode })

    return (
      <LoadingOverlay loading={showLoading && showLoadingAsOverlay}>
        <div className="vtex-search-result vtex-p pv5 ph4">
          <div className="vtex-search-result__breadcrumb db-ns dn-s">
            <ExtensionPoint id="breadcrumb" {...breadcrumbsProps} />
          </div>
          <div className="vtex-search-result__total-products pb5 bn-ns bb-s b--muted-4 tc-s tl">
            <span className="vtex-search-result__term dn-ns db-s t-heading-5">
              {term}
            </span>
            <FormattedMessage
              id="search.total-products"
              values={{ recordsFiltered }}
            >
              {txt => <span className="ph4 c-muted-2">{txt}</span>}
            </FormattedMessage>
          </div>
          {!hideFacets && (
            <div className="vtex-search-result__filters">
              <div className={filterClasses}>
                <ExtensionPoint
                  id="filter-navigator"
                  brands={brands}
                  getLinkProps={getLinkProps}
                  map={map}
                  params={params}
                  priceRange={priceRange}
                  priceRanges={priceRanges}
                  query={query}
                  rest={rest}
                  specificationFilters={specificationFilters}
                  tree={tree}
                  hiddenFacets={hiddenFacets}
                  loading={loading && !fetchMoreLoading}
                />
              </div>
            </div>
          )}
          <div className="vtex-search-result__order-by">
            <div >
              <OrderBy
                orderBy={orderBy}
                getLinkProps={getLinkProps}
              />
            </div>
          </div>
          {mobileMode && <div className="vtex-search-result__switch">
            <div className="dn-ns db-s">
              <LayoutModeSwitcher
                activeMode={this.state.galleryLayoutMode}
                onChange={this.handleLayoutChange}
              />
            </div>
          </div>}

          <div className="vtex-search-result__gallery">
            {showContentLoader ? (
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
      </LoadingOverlay>
    )
  }
}

export default withRuntimeContext(injectIntl(SearchResult))