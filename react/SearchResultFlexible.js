import React, { useMemo, useEffect, useRef } from 'react'
import ContextProviders from './components/ContextProviders'
import SearchResultContainer from './components/SearchResultContainer'
import {
  SearchPageContext,
  SearchPageStateContext,
  SearchPageStateDispatch,
  useSearchPageStateReducer,
} from 'vtex.search-page-context/SearchPageContext'
import { useCssHandles } from 'vtex.css-handles'
import { useRuntime } from 'vtex.render-runtime'

import { generateBlockClass } from '@vtex/css-handles'
import { pathOr, isEmpty } from 'ramda'

import getFilters from './utils/getFilters'
import LoadingOverlay from './components/LoadingOverlay'
import { PAGINATION_TYPE } from './constants/paginationType'

import styles from './searchResult.css'

const emptyFacets = {
  brands: [],
  priceRanges: [],
  specificationFilters: [],
  categoriesTrees: [],
}

const CSS_HANDLES = ['loadingOverlay']

const useShowContentLoader = (searchQuery, dispatch) => {
  const loadingRef = useRef(searchQuery.loading)
  const previousLoading = loadingRef.current
  const isLoading = searchQuery && searchQuery.loading
  useEffect(() => {
    if (previousLoading && !isLoading) {
      loadingRef.current = false
      dispatch({ type: 'HIDE_CONTENT_LOADER' })
    }
  }, [dispatch, isLoading, previousLoading])
}

const SearchResultFlexible = ({
  children,
  hiddenFacets,
  pagination = PAGINATION_TYPE.SHOW_MORE,
  mobileLayout = { mode1: 'normal' },
  defaultGalleryLayout,
  showProductsCount,
  blockClass,
  preventRouteChange = false,
  showFacetQuantity = false,
  // Below are set by SearchContext
  searchQuery,
  maxItemsPerPage,
  map,
  params,
  priceRange,
  orderBy,
  page,
  facetsLoading,
  trackingId,
  thresholdForFacetSearch,
  lazyItemsRemaining,
}) => {
  //This makes infinite scroll unavailable.
  //Infinite scroll was deprecated and we have
  //removed it since the flexible search release
  if (pagination === PAGINATION_TYPE.INFINITE_SCROLL) {
    pagination = PAGINATION_TYPE.SHOW_MORE
    console.warn('Infinite scroll cannot be used in flexible search')
  }
  pagination =
    pagination === PAGINATION_TYPE.INFINITE_SCROLL
      ? PAGINATION_TYPE.SHOW_MORE
      : pagination
  const facets = pathOr(emptyFacets, ['data', 'facets'], searchQuery)
  const {
    brands,
    brandsQuantity,
    priceRanges,
    specificationFilters,
    categoriesTrees,
  } = facets
  const filters = useMemo(
    () =>
      getFilters({
        specificationFilters,
        priceRanges,
        brands,
        brandsQuantity,
        hiddenFacets,
      }),
    [brands, hiddenFacets, priceRanges, specificationFilters, brandsQuantity]
  )

  const handles = useCssHandles(CSS_HANDLES)

  const hideFacets = !map
  const showCategories =
    hiddenFacets &&
    hiddenFacets.categories === false &&
    categoriesTrees &&
    categoriesTrees.length > 0
  const showFacets = showCategories || (!hideFacets && !isEmpty(filters))
  const { query: runtimeQuery } = useRuntime()
  const [state, dispatch] = useSearchPageStateReducer({
    mobileLayout: mobileLayout.mode1,
    showContentLoader: searchQuery.loading,
    selectedGalleryLayout: runtimeQuery.layout || defaultGalleryLayout,
  })

  useShowContentLoader(searchQuery, dispatch)

  const settings = useMemo(
    () => ({
      hiddenFacets,
      pagination,
      mobileLayout,
      showFacetQuantity,
      trackingId,
      thresholdForFacetSearch,
    }),
    [
      hiddenFacets,
      mobileLayout,
      pagination,
      showFacetQuantity,
      trackingId,
      thresholdForFacetSearch,
    ]
  )

  const context = useMemo(() => {
    const selectedFacets = filters.flatMap((filter) =>
      filter.facets.filter((facet) => facet.selected)
    )

    return {
      hiddenFacets,
      pagination,
      mobileLayout,
      searchQuery,
      page,
      maxItemsPerPage,
      map,
      params,
      priceRange,
      orderBy,
      showFacets,
      filters,
      showProductsCount,
      preventRouteChange,
      facetsLoading,
      lazyItemsRemaining,
      selectedFacets,
    }
  }, [
    hiddenFacets,
    pagination,
    mobileLayout,
    searchQuery,
    page,
    maxItemsPerPage,
    map,
    params,
    priceRange,
    orderBy,
    showFacets,
    filters,
    showProductsCount,
    preventRouteChange,
    facetsLoading,
    lazyItemsRemaining,
  ])

  const showLoading = searchQuery.loading && !state.isFetchingMore
  return (
    <SearchPageContext.Provider value={context}>
      <SearchPageStateContext.Provider value={state}>
        <SearchPageStateDispatch.Provider value={dispatch}>
          <ContextProviders
            queryVariables={searchQuery.variables}
            settings={settings}
          >
            <SearchResultContainer
              searchQuery={searchQuery}
              maxItemsPerPage={maxItemsPerPage}
              pagination={pagination}
              mobileLayout={mobileLayout}
              map={map}
              params={params}
              priceRange={priceRange}
              hiddenFacets={hiddenFacets}
              orderBy={orderBy}
              page={page}
              facetsLoading={facetsLoading}
              lazyItemsRemaining={lazyItemsRemaining}
            >
              <LoadingOverlay loading={showLoading}>
                <div
                  className={`${
                    handles.loadingOverlay
                  } w-100 flex flex-column flex-grow-1 ${generateBlockClass(
                    styles['container--layout'],
                    blockClass
                  )}`}
                >
                  {children}
                </div>
              </LoadingOverlay>
            </SearchResultContainer>
          </ContextProviders>
        </SearchPageStateDispatch.Provider>
      </SearchPageStateContext.Provider>
    </SearchPageContext.Provider>
  )
}

SearchResultFlexible.schema = {
  title: 'admin/editor.search-result-desktop.title',
}

export default SearchResultFlexible
