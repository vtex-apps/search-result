import classNames from 'classnames'
import produce from 'immer'
import { map, flatten, filter, prop, compose } from 'ramda'
import React, {
  useRef,
  useState,
  useEffect,
  Fragment,
  useCallback,
} from 'react'
import { FormattedMessage } from 'react-intl'

import { Button } from 'vtex.styleguide'
import { IconFilter } from 'vtex.store-icons'

import AccordionFilterContainer from './AccordionFilterContainer'
import Sidebar from './SideBar'
import useSelectedFilters from '../hooks/useSelectedFilters'
import useFacetNavigation from '../hooks/useFacetNavigation'

import searchResult from '../searchResult.css'

const FilterSidebar = ({ filters, tree }) => {
  const [open, setOpen] = useState(false)

  const {
    tree: currentTree,
    onAddCategories,
    onRemoveCategories,
  } = useCategoryTree(tree) // eslint-disable-line @typescript-eslint/no-use-before-define

  const selectedFiltersFromProps = filter(
    prop('selected'),
    useSelectedFilters(
      compose(
        flatten,
        map(prop('facets'))
      )(filters)
    )
  )

  const [selectedFilters, setSelectedFilters] = useState(
    selectedFiltersFromProps
  )

  const navigateToFacet = useFacetNavigation()

  const lastSelectedFilters = useRef(selectedFilters)

  useEffect(() => {
    if (!open) {
      lastSelectedFilters.current = selectedFilters
    }
  }, [selectedFilters, open])

  const isOptionSelected = opt =>
    !!selectedFilters.find(facet => facet.value === opt.value)

  const handleFilterCheck = filter => {
    if (!isOptionSelected(filter)) {
      setSelectedFilters(selectedFilters.concat(filter))
    } else {
      setSelectedFilters(
        selectedFilters.filter(facet => facet.value !== filter.value)
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
    setSelectedFilters(lastSelectedFilters.current)
  }

  const handleApply = () => {
    navigateToFacet(selectedFilters)
  }

  const handleUpdateCategories = maybeCategories => {
    const categories = Array.isArray(maybeCategories)
      ? maybeCategories
      : [maybeCategories]

    // whether we are adding (selecting) or removing
    // the categories from the tree
    const isAddOperation = categories.every(category => !category.selected)

    if (isAddOperation) {
      setSelectedFilters(filters => [...filters, ...categories])

      onAddCategories(categories)
    } else {
      setSelectedFilters(filters =>
        filters.filter(filter => categories.includes(filter))
      )

      onRemoveCategories(categories)
    }
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
          selectedFilters={selectedFilters}
          isOptionSelected={isOptionSelected}
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
const useCategoryTree = initialTree => {
  const [tree, setTree] = useState(initialTree)

  const onAddCategories = useCallback(categories => {
    setTree(
      produce(draft => {
        let selectedLevel = draft

        while (selectedLevel.some(category => category.selected)) {
          selectedLevel = selectedLevel.find(category => category.selected)
            .children
        }

        categories.forEach(category => {
          const index = selectedLevel.findIndex(
            levelCategory => levelCategory.value === category.value
          )

          selectedLevel[index].selected = true
          selectedLevel = selectedLevel[index].children
        })
      })
    )
  }, [])

  const onRemoveCategories = useCallback(categories => {
    setTree(
      produce(draft => {
        let currentLevel = draft

        while (
          currentLevel.find(category => category.selected).value !==
          categories[0].value
        ) {
          currentLevel = currentLevel.find(category => category.selected)
            .children
        }

        categories.forEach(category => {
          let selectedIndex = currentLevel.findIndex(
            cat => cat.value === category.value
          )

          currentLevel[selectedIndex].selected = false
          currentLevel = currentLevel[selectedIndex].children
        })
      })
    )
  }, [])

  return { tree, onAddCategories, onRemoveCategories }
}

export default FilterSidebar
