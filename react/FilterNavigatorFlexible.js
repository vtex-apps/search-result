import React from 'react'
import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'
import { useDevice } from 'vtex.device-detector'
import { pathOr } from 'ramda'

import FilterNavigator from './FilterNavigator'
import FilterNavigatorContext from './components/FilterNavigatorContext'

import styles from './searchResult.css'

const withSearchPageContextProps = Component => ({
  layout,
  initiallyCollapsed,
  maxItemsDepartment,
  maxItemsCategory,
  keepOneFilterOpened,
}) => {
  const {
    searchQuery,
    map,
    params,
    priceRange,
    hiddenFacets,
    filters,
    showFacets,
    preventRouteChange,
    facetsLoading,
  } = useSearchPage()
  const { isMobile } = useDevice()

  const facets = pathOr({}, ['data', 'facets'], searchQuery)
  const {
    brands,
    priceRanges,
    specificationFilters,
    categoriesTrees,
    queryArgs,
  } = facets

  if (showFacets === false || !map) {
    return null
  }

  return (
    <div
      className={`${styles['filters--layout']} ${
        layout === 'desktop' && isMobile ? 'w-100 mh5' : ''
        }`}
    >
      <FilterNavigatorContext.Provider value={queryArgs}>
        <Component
          preventRouteChange={preventRouteChange}
          brands={brands}
          params={params}
          priceRange={priceRange}
          priceRanges={priceRanges}
          specificationFilters={specificationFilters}
          tree={categoriesTrees}
          loading={facetsLoading}
          filters={filters}
          hiddenFacets={hiddenFacets}
          layout={layout}
          initiallyCollapsed={initiallyCollapsed}
          maxItemsDepartment={maxItemsDepartment}
          maxItemsCategory={maxItemsCategory}
          keepOneFilterOpened={keepOneFilterOpened}
        />
      </FilterNavigatorContext.Provider>
    </div>
  )
}

export default withSearchPageContextProps(FilterNavigator)
