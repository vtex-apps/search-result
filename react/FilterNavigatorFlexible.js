import React from 'react'
import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'
import { pathOr } from 'ramda'

import FilterNavigator from './FilterNavigator'

import styles from './searchResult.css'

const withSearchPageContextProps = Component => () => {
  const {
    searchQuery,
    map,
    params,
    priceRange,
    hiddenFacets,
    filters,
    showFacets,
    showContentLoader,
  } = useSearchPage()

  const facets = pathOr({}, ['data', 'facets'], searchQuery)
  const { brands, priceRanges, specificationFilters, categoriesTrees } = facets

  if (showFacets === false) {
    return null
  }

  return (
    <Component
      brands={brands}
      showFilters={!!map}
      params={params}
      priceRange={priceRange}
      priceRanges={priceRanges}
      specificationFilters={specificationFilters}
      tree={categoriesTrees}
      loading={showContentLoader}
      filters={filters}
      hiddenFacets={hiddenFacets}
      wrapperClass={styles['filters--layout']}
    />
  )
}

export default withSearchPageContextProps(FilterNavigator)
