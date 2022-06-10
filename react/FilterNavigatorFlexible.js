import React, { useMemo, useEffect } from 'react'
import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'
import { useDevice } from 'vtex.device-detector'
import { useLazyQuery } from 'react-apollo'

import FilterNavigator from './FilterNavigator'
import FilterNavigatorContext from './components/FilterNavigatorContext'
import styles from './searchResult.css'
import { sortFilterValues } from './utils/sortFilterValues'
import getFieldPosition from './graphql/getFieldPosition.gql'
 
const withSearchPageContextProps = (Component) => ({
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

  const [
    getFieldPositionQuery,
    { loading: loadingGetFieldPosition, error: errorGetFieldPosition, data: dataGetFieldPosition },
  ] = useLazyQuery(getFieldPosition)

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

  useEffect(() => {
    getFieldPositionQuery({ variables: { id: 30 } })
  }, [])

  useEffect(() => {
    if(loadingGetFieldPosition) {
      console.log('loadingGetFieldPosition', loadingGetFieldPosition)
    }

    if(errorGetFieldPosition) {
      console.log('errorGetFieldPosition', errorGetFieldPosition)
    }

    if (dataGetFieldPosition) {
      console.log('dataGetFieldPosition', dataGetFieldPosition)
    }
    
  }, [loadingGetFieldPosition,errorGetFieldPosition,dataGetFieldPosition])
  

  /*https://tiendadevi.vtexcommercestable.com.br/api/catalog_system/pvt/specification/fieldValue/127

  {
    "FieldValueId": 127,
    "FieldId": 30,
    "Name": "30ml",
    "Text": null,
    "IsActive": true,
    "Position": 1
  }

  Me quedo con el FieldId
  https://tiendadevi.vtexcommercestable.com.br/api/catalog/pvt/specification/FieldId
  const id = FieldId
  query test ($id: ID){
  field(id: $id) @context(provider: "vtex.catalog-graphql") {
    description
    categoryId
    position
  }
  }

  {
    "id": "26"
  }

  {
      "Id": 26,
      "FieldTypeId": 6,
      "CategoryId": 4,
      "FieldGroupId": 7,
      "Name": "EXM Aromas Victoria Chacin",
      "Description": "Aromas",
      "Position": 1,
      "IsFilter": true,
      "IsRequired": false,
      "IsOnProductDetails": true,
      "IsStockKeepingUnit": false,
      "IsWizard": false,
      "IsActive": true,
      "IsTopMenuLinkActive": true,
      "IsSideMenuLinkActive": true,
      "DefaultValue": ""
  }

  Me quedo con el Position

  */
  console.log('filters', filters)
  const sortedFilters = useMemo(
    () => sortFilterValues(filters, facetOrdering),
    [filters, facetOrdering]
  )
  console.log('sortedFilters', sortedFilters)
  const sortedFiltersAux = []

  //Aca obtengo la posicion de cada Categoria
    //-> Traerlos por API
  sortedFilters.forEach((filter) => {
    if (filter.title === 'EXM Aromas Victoria Chacin') {
      sortedFiltersAux.push(filter)
    }
    if (filter.title === 'EXM Género Victoria Chacin') {
      sortedFiltersAux.push(filter)
    }
  })
  console.log('sortedFiltersAux', sortedFiltersAux)

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
