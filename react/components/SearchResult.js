import React, { Component } from 'react'
import { Spinner } from 'vtex.styleguide'
import { ExtensionPoint } from 'render'
import { FormattedMessage, FormattedPlural, injectIntl, intlShape } from 'react-intl'
import classNames from 'classnames'
import { withRuntimeContext } from 'render'
import LoadingOverlay from './LoadingOverlay'
import { searchResultPropTypes } from '../constants/propTypes'
import OrderBy from './OrderBy'
import LayoutModeSwitcher, { LAYOUT_MODE } from './LayoutModeSwitcher'

/**
 * Search Result Component.
 */
class SearchResult extends Component {
  static propTypes = searchResultPropTypes

  static defaultProps = {
    hiddenFacets: {
      layoutMode1: LAYOUT_MODE[0].value,
      layoutMode2: LAYOUT_MODE[1].value,
    }
  }

  state = {
    galleryLayoutMode: this.props.hiddenFacets.layoutMode1 || LAYOUT_MODE[0].value,
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
    intl: intlShape,
  }

  handleLayoutChange = (e, mode) => {
    e.preventDefault()

    const defaultModes = [this.props.hiddenFacets.layoutMode1, this.props.hiddenFacets.layoutMode2]
    const modeIndex = (defaultModes.indexOf(this.state.galleryLayoutMode) + 1) % 2
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
      if (!props.hiddenFacets.layoutMode1 && !props.hiddenFacets.layoutMode2) {
        props.hiddenFacets.layoutMode1 = LAYOUT_MODE[0].value
        props.hiddenFacets.layoutMode2 = LAYOUT_MODE[1].value
      }

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
      intl,
      children,
      breadcrumbsProps,
      getLinkProps,
      loading,
      fetchMoreLoading,
      summary,
      orderBy,
      runtime: { hints: { mobile } },
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
    const filterClasses = classNames({ 'flex justify-center flex-auto pt1 ': mobile })

    return (
      <LoadingOverlay loading={showLoading && showLoadingAsOverlay}>
        <div className="vtex-search-result vtex-p pv5 ph3">
          {mobile && (<div className="vtex-search-result__divider bt bw1 b--muted-4 w-100"></div>)}
          <div className="vtex-search-result__breadcrumb db-ns dn-s">
            <ExtensionPoint id="breadcrumb" {...breadcrumbsProps} />
          </div>
          <div className="vtex-search-result__total-products pv5 bn-ns bt-s b--muted-4 tc-s tl">
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
          {mobile && <div className="vtex-search-result__border bg-muted-5 h-50 self-center" />}
          <div className="vtex-search-result__order-by">
            <OrderBy
              orderBy={orderBy}
              getLinkProps={getLinkProps}
            />
          </div>
          {mobile && <div className="vtex-search-result__border-2 bg-muted-5 h-50 self-center" />}
          {mobile && (
            <div className="vtex-search-result__switch">
              <LayoutModeSwitcher
                activeMode={galleryLayoutMode}
                onChange={this.handleLayoutChange}
              />
            </div>
          )}
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
                  className="bn"
                  layoutMode={galleryLayoutMode}
                />
              )}
            {children}
          </div>
        </div>
      </LoadingOverlay>
    )
  }
}

export default injectIntl(withRuntimeContext(SearchResult))