import React, { Component } from 'react'
import { compose } from 'react-apollo'
import { Spinner } from 'vtex.styleguide'
import { ExtensionPoint, withRuntimeContext } from 'vtex.render-runtime'
import { withDevice } from 'vtex.device-detector'
import { isEmpty } from 'ramda'
import { generateBlockClass } from '@vtex/css-handles'

import LoadingOverlay from './LoadingOverlay'
import { searchResultPropTypes } from '../constants/propTypes'
import LayoutModeSwitcher, { LAYOUT_MODE } from './LayoutModeSwitcher'
import FetchPreviousButton from './loaders/FetchPreviousButton'
import FetchMoreButton from './loaders/FetchMoreButton'
import LoadingSpinner from './loaders/LoadingSpinner'
import { PAGINATION_TYPE } from '../constants/paginationType'

import getFilters from '../utils/getFilters'

import styles from '../searchResult.css'

/**
 * Search Result Component.
 */
class SearchResult extends Component {
  static propTypes = searchResultPropTypes

  static defaultProps = {
    mobileLayout: {
      mode1: LAYOUT_MODE[0].value,
      mode2: LAYOUT_MODE[1].value,
    },
  }

  state = {
    mobileLayoutMode: this.props.mobileLayout.mode1,
    showLoadingAsOverlay: false,
    // The definitions bellow are required because
    // on SSR the getDerivedStateFromProps isn't called
    products: this.props.products,
    recordsFiltered: this.props.recordsFiltered,
    brands: this.props.brands,
    params: this.props.params,
    priceRange: this.props.priceRange,
    priceRanges: this.props.priceRanges,
    specificationFilters: this.props.specificationFilters,
    tree: this.props.tree,
    hiddenFacets: this.props.hiddenFacets,
  }

  handleMobileLayoutChange = e => {
    e.preventDefault()

    const modes = [this.props.mobileLayout.mode1, this.props.mobileLayout.mode2]
    const modeIndex = (modes.indexOf(this.state.mobileLayoutMode) + 1) % 2
    const currentMode = modes[modeIndex]

    this.setState({
      mobileLayoutMode: currentMode,
    })
  }

  static getDerivedStateFromProps(props) {
    // Do not use the props when the query is loading
    // so we can show the previous products when the
    // overlay is on the screen
    if (!props.loading) {
      if (!props.mobileLayout.mode1 && !props.mobileLayout.mode2) {
        props.mobileLayout.mode1 = LAYOUT_MODE[0].value
        props.mobileLayout.mode2 = LAYOUT_MODE[1].value
      }

      const {
        products,
        recordsFiltered,
        brands,
        params,
        priceRange,
        priceRanges,
        specificationFilters,
        tree,
        hiddenFacets,
      } = props

      return {
        products,
        recordsFiltered,
        brands,
        params,
        priceRange,
        priceRanges,
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
      to,
      from,
      onFetchMore,
      onFetchPrevious,
      showProductsCount,
      breadcrumbsProps,
      loading,
      fetchMoreLoading,
      summary,
      orderBy,
      mobileLayout,
      isMobile,
      pagination,
      infiniteScrollError,
      facetsLoading,
    } = this.props

    const {
      mobileLayoutMode,
      recordsFiltered,
      products = [],
      brands,
      params,
      priceRange,
      priceRanges,
      specificationFilters,
      tree,
      hiddenFacets,
      showLoadingAsOverlay,
    } = this.state

    const queryArgs = this.props.searchQuery.facets
      ? this.props.searchQuery.facets.queryArgs
      : { query: null, map: null }

    const { map } = queryArgs

    const hideFacets = !map || !map.length
    const showLoading = loading && !fetchMoreLoading
    const showFacetsContentLoader = facetsLoading && !fetchMoreLoading
    const showContentLoader = showLoading && !showLoadingAsOverlay
    const shouldDisplayLayoutSwitcher = !!mobileLayout.mode2

    const filters = getFilters({
      specificationFilters,
      priceRanges,
      brands,
      hiddenFacets,
    })

    const showCategories =
      hiddenFacets &&
      hiddenFacets.categories === false &&
      tree &&
      tree.length > 0

    const showFacets = showCategories || (!hideFacets && !isEmpty(filters))

    return (
      <LoadingOverlay loading={showLoading && showLoadingAsOverlay}>
        <div
          className={`${generateBlockClass(
            styles.container,
            this.props.blockClass
          )} w-100 mw9`}
        >
          <div data-testid="breadcrumb" className={styles.breadcrumb}>
            <ExtensionPoint id="breadcrumb" {...breadcrumbsProps} />
          </div>
          <div className={styles.richTitle}>
            <ExtensionPoint id="rich-text" />
          </div>
          <ExtensionPoint
            id="search-title"
            breadcrumb={breadcrumbsProps.breadcrumb}
            wrapperClass={styles.galleryTitle}
          />
          {showFacets && !!map && (
            <div className={styles.filters}>
              <ExtensionPoint
                id="filter-navigator"
                brands={brands}
                params={params}
                priceRange={priceRange}
                priceRanges={priceRanges}
                specificationFilters={specificationFilters}
                tree={tree}
                loading={showFacetsContentLoader}
                filters={filters}
                hiddenFacets={hiddenFacets}
                queryArgs={queryArgs}
              />
            </div>
          )}
          <ExtensionPoint
            id="total-products"
            recordsFiltered={recordsFiltered}
            wrapperClass={styles.totalProducts}
          />
          <div className={styles.resultGallery}>
            <FetchPreviousButton
              products={products}
              from={from}
              onFetchPrevious={onFetchPrevious}
              loading={fetchMoreLoading}
            />
            {showContentLoader ? (
              <div className="w-100 flex justify-center">
                <div className="w3 ma0">
                  <Spinner />
                </div>
              </div>
            ) : products.length > 0 ? (
              <ExtensionPoint
                id="gallery"
                products={products}
                summary={summary}
                className="bn"
                mobileLayoutMode={mobileLayoutMode}
                showingFacets={showFacets}
              />
            ) : (
              <div className={styles.gallery}>
                <ExtensionPoint id="not-found" />
              </div>
            )}
            {pagination === PAGINATION_TYPE.SHOW_MORE || infiniteScrollError ? (
              <FetchMoreButton
                products={products}
                to={to}
                recordsFiltered={recordsFiltered}
                onFetchMore={onFetchMore}
                loading={fetchMoreLoading}
                showProductsCount={showProductsCount}
              />
            ) : (
              <LoadingSpinner loading={fetchMoreLoading} />
            )}
          </div>
          <div className={styles.orderBy}>
            <ExtensionPoint
              id="order-by"
              orderBy={orderBy}
              wrapperClass={styles.orderBy}
            />
          </div>
          {isMobile && shouldDisplayLayoutSwitcher && (
            <div
              className={`${styles.switch} flex justify-center items-center`}
            >
              <LayoutModeSwitcher
                activeMode={mobileLayoutMode}
                onChange={this.handleMobileLayoutChange}
              />
            </div>
          )}
        </div>
      </LoadingOverlay>
    )
  }
}

export default compose(withRuntimeContext, withDevice)(SearchResult)
