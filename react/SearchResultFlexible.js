import React, { useMemo, useReducer, useEffect, useRef } from 'react'
import ContextProviders from './components/ContextProviders'
import SearchResultContainer from './components/SearchResultContainer'
import {
  SearchPageContext,
  SearchPageStateContext,
  SearchPageStateDispatch,
} from 'vtex.search-page-context/SearchPageContext'
import { generateBlockClass } from '@vtex/css-handles'
import { pathOr, isEmpty } from 'ramda'

import getFilters from './utils/getFilters'
import LoadingOverlay from './components/LoadingOverlay'

import styles from './searchResult.css'

const emptyFacets = {
  brands: [],
  priceRanges: [],
  specificationFilters: [],
  categoriesTrees: [],
}

function reducer(state, action) {
  const args = action.args || {}
  switch (action.type) {
    case 'SWITCH_LAYOUT':
      const { mobileLayout } = args
      return { ...state, mobileLayout }
    case 'HIDE_CONTENT_LOADER':
      return { ...state, showContentLoader: false }
    case 'SET_FETCHING_MORE':
      const { isFetchingMore } = args
      return { ...state, isFetchingMore }
    default:
      return state
  }
}

const useShowContentLoader = (searchQuery, dispatch) => {
  const loadingRef = useRef(true)
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
  pagination = 'infinite-scroll',
  mobileLayout = { mode1: 'normal' },
  showProductsCount,
  blockClass,
  // Below are set by SearchContext
  searchQuery,
  maxItemsPerPage,
  map,
  params,
  priceRange,
  orderBy,
}) => {
  const facets = pathOr(emptyFacets, ['data', 'facets'], searchQuery)
  const { brands, priceRanges, specificationFilters, categoriesTrees } = facets
  const filters = useMemo(
    () =>
      getFilters({
        specificationFilters,
        priceRanges,
        brands,
        hiddenFacets,
      }),
    [brands, hiddenFacets, priceRanges, specificationFilters]
  )

  const hideFacets = !map
  const showCategories =
    hiddenFacets &&
    hiddenFacets.categories === false &&
    categoriesTrees &&
    categoriesTrees.length > 0
  const showFacets = showCategories || (!hideFacets && !isEmpty(filters))

  const [state, dispatch] = useReducer(reducer, {
    mobileLayout: mobileLayout.mode1,
    showContentLoader: true,
    isFetchingMore: false,
  })

  useShowContentLoader(searchQuery, dispatch)

  const settings = useMemo(
    () => ({
      hiddenFacets,
      pagination,
      mobileLayout,
    }),
    [hiddenFacets, mobileLayout, pagination]
  )

  const context = useMemo(
    () => ({
      hiddenFacets,
      pagination,
      mobileLayout,
      searchQuery,
      maxItemsPerPage,
      map,
      params,
      priceRange,
      orderBy,
      showFacets,
      filters,
      showProductsCount,
    }),
    [
      hiddenFacets,
      map,
      maxItemsPerPage,
      mobileLayout,
      orderBy,
      pagination,
      params,
      priceRange,
      searchQuery,
      showFacets,
      filters,
      showProductsCount,
    ]
  )

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
            >
              {
                <LoadingOverlay loading={searchQuery.loading}>
                  <div
                    className={`flex flex-column flex-grow-1 ${generateBlockClass(
                      styles['container--layout'],
                      blockClass
                    )}`}
                  >
                    {children}
                  </div>
                </LoadingOverlay>
              }
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
