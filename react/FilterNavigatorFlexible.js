import React, { useMemo } from 'react'
import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'
import { useDevice } from 'vtex.device-detector'

import FilterNavigator from './FilterNavigator'
import FilterNavigatorContext from './components/FilterNavigatorContext'
import styles from './searchResult.css'
import { sortFilterValues } from './utils/sortFilterValues'

const withSearchPageContextProps =
  Component =>
  // eslint-disable-next-line react/display-name
  ({
    layout,
    initiallyCollapsed,
    scrollToTop,
    maxItemsDepartment,
    maxItemsCategory,
    categoryFiltersMode,
    filtersTitleHtmlTag,
    truncateFilters,
    openFiltersMode,
    closeOnOutsideClick,
    appliedFiltersOverview,
    totalProductsOnMobile,
    fullWidthOnMobile,
    navigationTypeOnMobile,
    updateOnFilterSelectionOnMobile,
    drawerDirectionMobile,
    showClearByFilter,
    showClearAllFiltersOnDesktop,
    priceRangeLayout,
    facetOrdering = [],
    showQuantityBadgeOnMobile = false,
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

    const filtersFetchMore =
      searchQuery && searchQuery.facets && searchQuery.facets.facetsFetchMore
        ? searchQuery.facets.facetsFetchMore
        : undefined

    const facets =
      searchQuery && searchQuery.data && searchQuery.data.facets
        ? searchQuery.data.facets
        : {}

    const {
      brands,
      priceRanges,
      specificationFilters,
      categoriesTrees,
      queryArgs,
    } = facets

    const sortedFilters = useMemo(
      () => sortFilterValues(filters, facetOrdering),
      [filters, facetOrdering]
    )

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
            filters={sortedFilters}
            filtersFetchMore={filtersFetchMore}
            hiddenFacets={hiddenFacets}
            layout={layout}
            initiallyCollapsed={initiallyCollapsed}
            scrollToTop={scrollToTop}
            maxItemsDepartment={maxItemsDepartment}
            maxItemsCategory={maxItemsCategory}
            categoryFiltersMode={categoryFiltersMode}
            filtersTitleHtmlTag={filtersTitleHtmlTag}
            truncateFilters={truncateFilters}
            openFiltersMode={openFiltersMode}
            closeOnOutsideClick={closeOnOutsideClick}
            appliedFiltersOverview={appliedFiltersOverview}
            totalProductsOnMobile={totalProductsOnMobile}
            fullWidthOnMobile={fullWidthOnMobile}
            navigationTypeOnMobile={navigationTypeOnMobile}
            updateOnFilterSelectionOnMobile={updateOnFilterSelectionOnMobile}
            showClearByFilter={showClearByFilter}
            showClearAllFiltersOnDesktop={showClearAllFiltersOnDesktop}
            priceRangeLayout={priceRangeLayout}
            drawerDirectionMobile={drawerDirectionMobile}
            showQuantityBadgeOnMobile={showQuantityBadgeOnMobile}
          />
        </FilterNavigatorContext.Provider>
      </div>
    )
  }

export default withSearchPageContextProps(FilterNavigator)
