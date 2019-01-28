import React, { Component } from 'react'
import { Spinner } from 'vtex.styleguide'
import { ExtensionPoint, withRuntimeContext } from 'vtex.render-runtime'

import LoadingOverlay from './LoadingOverlay'
import { searchResultPropTypes } from '../constants/propTypes'
import LayoutModeSwitcher, { LAYOUT_MODE } from './LayoutModeSwitcher'

import searchResult from '../searchResult.css'

const HEADER_SIZE = 36
const CONVERSION_MARGIN_VALUE = 0.08
const MARGIN_TOP = "-2.4rem"
const FADE_DURATION = "500ms" // It should be passed via props in the future
const FADE_DELAY = "0ms" // Same as above

/**
 * Search Result Component.
 */
class SearchResult extends Component {
  static propTypes = searchResultPropTypes

  static defaultProps = {
    hiddenFacets: {
      layoutMode1: LAYOUT_MODE[0].value,
      layoutMode2: LAYOUT_MODE[1].value,
    },
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
    scrollValue: 0
  }

  searchOptionsBar = React.createRef()

  handleLayoutChange = e => {
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

    document.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll = () => {
    const scroll = this.props.leanMode ? Infinity : window.scrollY
    const {runtime: { hints: { mobile } }} = this.props
    
    if (typeof scroll !== 'number' || !mobile) return

    if (scroll > this.state.scrollValue) this.handleScrollDown()
    else if (scroll < this.state.scrollValue) this.handleScrollUp(scroll)

    this.setState({scrollValue: scroll})
  }

  handleScrollUp = scrollValue => {
    const marginValue = scrollValue * CONVERSION_MARGIN_VALUE

    const searchOptionsBarElement = this.searchOptionsBar.current
    if (searchOptionsBarElement) {
      searchOptionsBarElement.style.transition = `opacity ${FADE_DURATION} ${FADE_DELAY}`
      searchOptionsBarElement.style.opacity = 1

      if (scrollValue < HEADER_SIZE) searchOptionsBarElement.style.marginTop = `-${marginValue}rem`
      else searchOptionsBarElement.style.marginTop = MARGIN_TOP
    }
  }

  handleScrollDown = () => {
    const searchOptionsBarElement = this.searchOptionsBar.current
    if (searchOptionsBarElement) {
      searchOptionsBarElement.style.opacity = 0
      searchOptionsBarElement.style.transition = `opacity ${FADE_DURATION} ${FADE_DELAY}`
    }
  }

  getSearchOptionsBar = () => {
    const {
      getLinkProps,
      loading,
      fetchMoreLoading,
      orderBy,
      runtime: { hints: { mobile } },
    } = this.props
    const {
      galleryLayoutMode,
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
    } = this.state

    const hideFacets = !map || !map.length

    return (
      <React.Fragment>
        {!hideFacets && (
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
        )}
        {mobile && <div className={`${searchResult.border} bg-muted-5 h-50 self-center`} />}
          <ExtensionPoint id="order-by"
            orderBy={orderBy}
            getLinkProps={getLinkProps}
          />
          {mobile && <div className={`${searchResult.border2} bg-muted-5 h-50 self-center`} />}
          {mobile && <div className={`${searchResult.switch} flex justify-center items-center`}>
            <div className="dn-ns db-s">
              <LayoutModeSwitcher
                activeMode={galleryLayoutMode}
                onChange={this.handleLayoutChange}
              />
            </div>
          </div>}
      </React.Fragment>
    )
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
      loading,
      fetchMoreLoading,
      summary,
      runtime: { hints: { mobile } },
    } = this.props
    const {
      galleryLayoutMode,
      recordsFiltered,
      products,
      map,
      params,
      showLoadingAsOverlay,
    } = this.state

    const term = params && params.term
      ? decodeURIComponent(params.term) : undefined

    if (!products.length && !loading) {
      return (
        <ExtensionPoint id="not-found" term={term} />
      )
    }

    const showLoading = loading && !fetchMoreLoading
    const showContentLoader = showLoading && !showLoadingAsOverlay
    const searchOptionsBarClasses = classNames({ 'flex justify-center flex-auto fixed z-1 bg-base bb bw1 b--light-gray': mobile })

    return (
      <LoadingOverlay loading={showLoading && showLoadingAsOverlay}>
        <div className={`${searchResult.container} w-100 mw9`}>
          <div className={`${searchResult.breadcrumb} db-ns dn-s`}>
            <ExtensionPoint id="breadcrumb" {...breadcrumbsProps} />
          </div>
          <div className={`${searchResult.totalProducts} pv5 bn-ns bt-s b--muted-4 tc-s tl`}>
            <FormattedMessage
              id="search.total-products"
              values={{ recordsFiltered }}
            >
              {txt => <span className="ph4 c-muted-2">{txt}</span>}
            </FormattedMessage>
          </div>
          {mobile ? (
            <div ref={this.searchOptionsBar} className={`${searchResult.searchOptionsBar} ${searchOptionsBarClasses}`}>
              {this.getSearchOptionsBar()}
            </div> 
          ): 
            this.getSearchOptionsBar()
          }
          <div className={searchResult.resultGallery}>
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

export default withRuntimeContext(SearchResult)
