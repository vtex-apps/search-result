import classNames from 'classnames'
import produce from 'immer'
import React, { useState, useEffect, useCallback, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

import { Button } from 'vtex.styleguide'
import { IconFilter } from 'vtex.store-icons'

import AccordionFilterContainer from './AccordionFilterContainer'
import Sidebar from './SideBar'
import useFacetNavigation from '../hooks/useFacetNavigation'

import searchResult from '../searchResult.css'

const FilterSidebar = ({ filters, tree }) => {
  const [open, setOpen] = useState(false)

  const [filterOperations, setFilterOperations] = useState([])
  const currentTree = useCategoryTree(tree, filterOperations) // eslint-disable-line @typescript-eslint/no-use-before-define

  const navigateToFacet = useFacetNavigation()

  const handleFilterCheck = filter => {
    if (!filter.selected) {
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

  const handleClearFilters = () => {
    setFilterOperations([])
  }

  const handleApply = () => {
    navigateToFacet(filterOperations)
  }

  const handleUpdateCategories = maybeCategories => {
    const categories = Array.isArray(maybeCategories)
      ? maybeCategories
      : [maybeCategories]

    setFilterOperations(filters =>
      filters.filter(operations => operations.map !== 'c').concat(categories)
    )
  }

  return (
    <Fragment>
      <button
        className={classNames(
          `${
            searchResult.filterPopupButton
          } ph3 pv5 mv0 mv0 pointer flex justify-center items-center`,
          {
            'bb b--muted-1': open,
            bn: !open,
          }
        )}
        onClick={handleOpen}
      >
        <span
          className={`${
            searchResult.filterPopupTitle
          } c-on-base t-action--small ml-auto`}
        >
          <FormattedMessage id="store/search-result.filter-action.title" />
        </span>
        <span
          className={`${searchResult.filterPopupArrowIcon} ml-auto pl3 pt2`}
        >
          <IconFilter size={16} viewBox="0 0 17 17" />
        </span>
      </button>

      <Sidebar onOutsideClick={handleClose} isOpen={open}>
        <AccordionFilterContainer
          filters={filters}
          tree={currentTree}
          onFilterCheck={handleFilterCheck}
          onCategorySelect={handleUpdateCategories}
        />
        <div
          className={`${
            searchResult.filterButtonsBox
          } bt b--muted-5 bottom-0 fixed w-100 items-center flex z-1 bg-base`}
        >
          <div className="bottom-0 fl w-50 pl4 pr2">
            <Button
              block
              variation="tertiary"
              size="regular"
              onClick={handleClearFilters}
            >
              <FormattedMessage id="store/search-result.filter-button.clear" />
            </Button>
          </div>
          <div className="bottom-0 fr w-50 pr4 pl2">
            <Button
              block
              variation="secondary"
              size="regular"
              onClick={handleApply}
            >
              <FormattedMessage id="store/search-result.filter-button.apply" />
            </Button>
          </div>
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
      let selectedIndex = currentLevel.findIndex(
        cat => cat.value === category.value
      )

      currentLevel[selectedIndex].selected = !currentLevel[selectedIndex]
        .selected
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
const useCategoryTree = (initialTree, filterOperations) => {
  const [tree, setTree] = useState(initialTree)

  useEffect(() => {
    setTree(initialTree)
  }, [initialTree])

  useEffect(() => {
    const categoryOperations = filterOperations.filter(
      operation => operation.map === 'c'
    )

    setTree(updateTree(categoryOperations))
  }, [filterOperations, initialTree])

  return tree
}

export default FilterSidebar
