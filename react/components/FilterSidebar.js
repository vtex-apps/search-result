import classNames from 'classnames'
import produce from 'immer'
import React, { useState, useEffect, useMemo, Fragment, useRef } from 'react'
import { FormattedMessage } from 'react-intl'
import { ExtensionPoint } from 'vtex.render-runtime'
import { Button } from 'vtex.styleguide'
import { IconFilter } from 'vtex.store-icons'
import { useCssHandles } from 'vtex.css-handles'
import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'
import { usePixel } from 'vtex.pixel-manager'

import FilterNavigatorContext, {
  useFilterNavigator,
} from './FilterNavigatorContext'
import AccordionFilterContainer from './AccordionFilterContainer'
import Sidebar from './SideBar'
import { MAP_CATEGORY_CHAR } from '../constants'
import { buildNewQueryMap } from '../hooks/useFacetNavigation'
import styles from '../searchResult.css'
import { getMainSearches } from '../utils/compatibilityLayer'
import {
  isCategoryDepartmentCollectionOrFT,
  filterCategoryDepartmentCollectionAndFT,
} from '../utils/queryAndMapUtils'
import { pushFilterManipulationPixelEvent } from '../utils/filterManipulationPixelEvents'

const CSS_HANDLES = [
  'filterPopupButton',
  'filterPopupTitle',
  'filterButtonsBox',
  'filterPopupArrowIcon',
  'filterClearButtonWrapper',
  'filterApplyButtonWrapper',
  'filterTotalProducts',
  'filterQuantityBadge',
]

const FilterSidebar = ({
  selectedFilters,
  filters,
  tree,
  priceRange,
  preventRouteChange,
  navigateToFacet,
  appliedFiltersOverview,
  totalProductsOnMobile,
  fullWidth,
  navigationType,
  initiallyCollapsed,
  truncateFilters,
  truncatedFacetsFetched,
  setTruncatedFacetsFetched,
  categoryFiltersMode,
  loading,
  updateOnFilterSelectionOnMobile,
  showClearByFilter,
  priceRangeLayout,
  filtersDrawerDirectionMobile,
  showQuantityBadgeOnMobile,
}) => {
  const { searchQuery } = useSearchPage()
  const filterContext = useFilterNavigator()
  const [open, setOpen] = useState(false)
  const handles = useCssHandles(CSS_HANDLES)
  const shouldClear = useRef(false)
  const recordsFiltered =
    searchQuery &&
    searchQuery.data &&
    searchQuery.data.productSearch &&
    searchQuery.data.productSearch.recordsFiltered

  const [filterOperations, setFilterOperations] = useState([])
  const [categoryTreeOperations, setCategoryTreeOperations] = useState([])
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const currentTree = useCategoryTree(tree, categoryTreeOperations)

  /* Sometimes there are categories included in selectedFilters
   * This useMemo extracts only filters that users can
   * enable and disable directly */
  const selectedFacetsLength = React.useMemo(() => {
    const filterKeys = filters.map(filter => filter.key)

    const selectedFacets =
      selectedFilters.filter(
        facet => filterKeys.includes(facet.key) && facet.selected
      ) ?? []

    return selectedFacets.length
  }, [filters, selectedFilters])

  const isFilterSelected = (slectableFilters, filter) => {
    return slectableFilters.find(
      filterOperation => filter.value === filterOperation.value
    )
  }

  const handleFilterCheck = filter => {
    if (updateOnFilterSelectionOnMobile && preventRouteChange) {
      navigateToFacet(filter, preventRouteChange)

      return
    }

    if (!isFilterSelected(filterOperations, filter)) {
      setFilterOperations(filterOperations.concat(filter))
    } else {
      setFilterOperations(
        filterOperations.filter(facet => facet.value !== filter.value)
      )
    }
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleOpen = () => {
    setOpen(true)
  }

  const handleApply = () => {
    setOpen(false)

    if (updateOnFilterSelectionOnMobile && preventRouteChange) {
      return
    }

    navigateToFacet(filterOperations, preventRouteChange)
    setFilterOperations([])
  }

  const { push } = usePixel()

  const [clearPriceRange, setClearPriceRange] = useState()

  const handleClearFilters = key => {
    pushFilterManipulationPixelEvent({
      name: 'CleanFilters',
      value: true,
      products: searchQuery?.products ?? [],
      push,
    })

    shouldClear.current =
      !updateOnFilterSelectionOnMobile || !preventRouteChange
    // Gets the previously selected facets that should be cleared
    const selectedFacets = selectedFilters.filter(
      facet =>
        !isCategoryDepartmentCollectionOrFT(facet.key) &&
        facet.selected &&
        (!key || (key && key === facet.key))
    )

    if (selectedFacets.length === 0 && key) {
      setFilterOperations(filterOperations.filter(filter => filter.key !== key))

      return
    }

    // Should not clear categories, departments and clusterIds
    const selectedRest = filterOperations.filter(facet =>
      isCategoryDepartmentCollectionOrFT(facet.key)
    )

    const facetsToRemove = [...selectedFacets, ...selectedRest]

    if (updateOnFilterSelectionOnMobile && preventRouteChange) {
      navigateToFacet(facetsToRemove, preventRouteChange)
      setClearPriceRange(true)

      return
    }

    setClearPriceRange(true)
    setFilterOperations(facetsToRemove)
  }

  const handleUpdateCategories = maybeCategories => {
    const categories = Array.isArray(maybeCategories)
      ? maybeCategories
      : [maybeCategories]

    /* There is no need to compare with CATEGORY and DEPARTMENT since
     they are seen as a normal facet in the new VTEX search */
    const categoriesSelected = filterOperations.filter(
      op => op.map === MAP_CATEGORY_CHAR
    )

    const newCategories = [...categoriesSelected, ...categories]

    if (updateOnFilterSelectionOnMobile && preventRouteChange) {
      navigateToFacet(newCategories, preventRouteChange)

      return
    }

    // Just save the newest operation here to be recorded at the category tree hook and update the tree
    setCategoryTreeOperations(categories)

    // Save all filters along with the new categories, appended to the old ones
    setFilterOperations(selectableFilters => {
      return selectableFilters
        .filter(operations => operations.map !== MAP_CATEGORY_CHAR)
        .concat(newCategories)
    })
  }

  const context = useMemo(() => {
    const { query, map } = filterContext
    const fullTextAndCollection = getMainSearches(query, map)

    /* This removes the previously selected stuff from the context when you click on 'clear'.
    It is important to notice that it keeps categories, departments and clusterIds since they
    are important to show the correct facets. */
    if (shouldClear.current) {
      shouldClear.current = false

      return filterCategoryDepartmentCollectionAndFT(filterContext)
    }

    /* The spread on selectedFilters was necessary because buildNewQueryMap
     changes the object but we do not want that on mobile */
    return {
      ...filterContext,
      ...buildNewQueryMap(fullTextAndCollection, filterOperations, [
        ...selectedFilters,
      ]),
    }
  }, [filterOperations, filterContext, selectedFilters])

  return (
    <Fragment>
      <button
        className={classNames(
          `${styles.filterPopupButton} ${
            showQuantityBadgeOnMobile ? 'relative' : ''
          }  ph3 pv5 mv0 mv0 pointer flex justify-center items-center`,
          {
            'bb b--muted-1': open,
            bn: !open,
          }
        )}
        onClick={handleOpen}
      >
        <span
          className={`${handles.filterPopupTitle} c-on-base t-action--small ml-auto`}
        >
          <FormattedMessage id="store/search-result.filter-action.title" />
        </span>
        <span className={`${handles.filterPopupArrowIcon} ml-auto pl3 pt2`}>
          <IconFilter size={16} viewBox="0 0 17 17" />

          {showQuantityBadgeOnMobile && selectedFacetsLength > 0 && (
            <span
              className={`${styles.filterQuantityBadgeDefault} ${handles.filterQuantityBadge} absolute t-mini bg-muted-2 c-on-muted-2 br4 w1 h1 pa1 flex justify-center items-center lh-solid`}
            >
              {selectedFacetsLength}
            </span>
          )}
        </span>
      </button>

      <Sidebar
        onOutsideClick={handleClose}
        isOpen={open}
        fullWidth={fullWidth}
        filtersDrawerDirectionMobile={filtersDrawerDirectionMobile}
      >
        <FilterNavigatorContext.Provider value={context}>
          <AccordionFilterContainer
            filters={filters}
            tree={currentTree}
            onFilterCheck={handleFilterCheck}
            onCategorySelect={handleUpdateCategories}
            priceRange={priceRange}
            appliedFiltersOverview={appliedFiltersOverview}
            navigationType={navigationType}
            initiallyCollapsed={initiallyCollapsed}
            truncateFilters={truncateFilters}
            truncatedFacetsFetched={truncatedFacetsFetched}
            setTruncatedFacetsFetched={setTruncatedFacetsFetched}
            categoryFiltersMode={categoryFiltersMode}
            loading={loading}
            onClearFilter={handleClearFilters}
            clearPriceRange={clearPriceRange}
            setClearPriceRange={setClearPriceRange}
            showClearByFilter={showClearByFilter}
            updateOnFilterSelectionOnMobile={updateOnFilterSelectionOnMobile}
            priceRangeLayout={priceRangeLayout}
          />
          <ExtensionPoint id="sidebar-close-button" onClose={handleClose} />
        </FilterNavigatorContext.Provider>
        <div
          className={`${styles.filterButtonsBox} bt b--muted-5 bottom-0 fixed w-100 items-center flex z-1 bg-base flex-wrap`}
        >
          <div
            className={`${handles.filterClearButtonWrapper} bottom-0 fl w-50 pl4 pr2`}
          >
            <Button
              block
              variation="tertiary"
              size="regular"
              onClick={() => handleClearFilters()}
            >
              <FormattedMessage id="store/search-result.filter-button.clear" />
            </Button>
          </div>
          <div
            className={`${handles.filterApplyButtonWrapper} bottom-0 fr w-50 pr4 pl2`}
          >
            <Button
              block
              variation="secondary"
              size="regular"
              onClick={handleApply}
            >
              <FormattedMessage id="store/search-result.filter-button.apply" />
            </Button>
          </div>
          {totalProductsOnMobile === 'show' && recordsFiltered && (
            <div
              className={`${handles.filterTotalProducts} w-100 flex flex-grow-1 items-center justify-center pre t-small`}
            >
              <FormattedMessage
                id="store/search.total-products-2"
                values={{
                  recordsFiltered,
                  // eslint-disable-next-line react/display-name
                  span: chunks => <span>{chunks}</span>,
                }}
              />
            </div>
          )}
        </div>
      </Sidebar>
    </Fragment>
  )
}

const updateTree = categories =>
  produce(draft => {
    if (!categories.length) {
      return
    }

    let currentLevel = draft

    while (
      !(
        currentLevel.find(category => category.value === categories[0].value) ||
        currentLevel.every(category => !category.selected)
      )
    ) {
      currentLevel = currentLevel.find(category => category.selected).children
    }

    categories.forEach(category => {
      const selectedIndex = currentLevel.findIndex(
        cat => cat.value === category.value
      )

      currentLevel[selectedIndex].selected =
        !currentLevel[selectedIndex].selected
      currentLevel = currentLevel[selectedIndex].children
    })
  })

// in order for us to avoid sending a request to the facets
// API and refetch all filters on every category change (like
// we are doing on desktop), we'll keep a local copy of the category
// tree structure, and locally modify it with the information we
// have.
//
// the component responsible for displaying the category tree
// in a user-friendly manner should reflect to the changes
// we make in the tree, the same as it would with a tree fetched
// from the API.
const useCategoryTree = (initialTree, categoryTreeOperations) => {
  const [tree, setTree] = useState(initialTree)

  useEffect(() => {
    setTree(initialTree)
  }, [initialTree])

  useEffect(() => {
    setTree(updateTree(categoryTreeOperations))
  }, [categoryTreeOperations, initialTree])

  return tree
}

export default FilterSidebar
