import React from 'react'
import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'
import { useDevice } from 'vtex.device-detector'
import { pathOr } from 'ramda'

import FilterNavigator from './FilterNavigator'

import styles from './searchResult.css'

const withSearchPageContextProps = Component => ({ layout }) => {
  const {
    searchQuery,
    map,
    params,
    priceRange,
    hiddenFacets,
    filters,
    showFacets,
    showContentLoader,
    preventRouteChange,
    facetsLoading,
  } = useSearchPage()
  const { isMobile } = useDevice()

  const facets = pathOr({}, ['data', 'facets'], searchQuery)
  const { brands, priceRanges, specificationFilters, categoriesTrees } = facets

  if (showFacets === false || !map) {
    return null
  }

  return (
    <div
      className={`${styles['filters--layout']} ${
        layout === 'desktop' && isMobile ? 'w-100 mh5' : ''
      }`}
    >
      <Component
        preventRouteChange={preventRouteChange}
        brands={brands}
        params={params}
        priceRange={priceRange}
        priceRanges={priceRanges}
        specificationFilters={specificationFilters}
        tree={categoriesTrees}
        loading={facetsLoading && showContentLoader}
        filters={filters}
        hiddenFacets={hiddenFacets}
        layout={layout}
      />
    </div>
  )
}

export default withSearchPageContextProps(FilterNavigator)
