import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import classNames from 'classnames'
import { IconCaret } from 'vtex.store-icons'
import { Spinner } from 'vtex.styleguide'

import AccordionFilterItem from './AccordionFilterItem'
import DepartmentFilters from './DepartmentFilters'
import AccordionFilterGroup from './AccordionFilterGroup'
import AccordionFilterPriceRange from './AccordionFilterPriceRange'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = [
  'filterBreadcrumbsItem',
  'filterBreadcrumbsItemName',
  'filterBreadcrumbsContent',
  'filterBreadcrumbsText',
  'filterBreadcrumbsList',
  'filterLoadingOverlay',
]
import styles from '../searchResult.css'

const CATEGORIES_TITLE = 'store/search.filter.title.categories'

const AccordionFilterContainer = ({
  filters,
  intl,
  onFilterCheck,
  tree,
  onCategorySelect,
  priceRange,
  appliedFiltersOverview,
  navigationType,
  initiallyCollapsed,
  truncateFilters,
  loading,
  onClearFilter,
  showClearByFilter,
  updateOnFilterSelectionOnMobile,
}) => {
  const [openItem, setOpenItem] = useState(null)
  const handles = useCssHandles(CSS_HANDLES)

  const handleOpen = id => e => {
    e.preventDefault()

    if (navigationType === 'collapsible') {
      return
    }

    if (openItem === id) {
      setOpenItem(null)
    } else {
      setOpenItem(id)
    }
  }

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      setOpenItem(null)
    }
  }

  const nonEmptyFilters = filters.filter(spec => spec.facets.length > 0)

  const departmentsOpen = openItem === CATEGORIES_TITLE

  const itemClassName = classNames(
    styles.accordionFilterItemOptions,
    'ph5 pt3 h-100 overflow-scroll',
    { pb9: navigationType !== 'collapsible'}
  )

  const showOverlay = updateOnFilterSelectionOnMobile && loading

  return (
    <div className={classNames(styles.accordionFilter, 'h-100 pb9', {
      'overflow-scroll': !openItem,
    })}>
      <div
        className={classNames(
          styles.filterAccordionBreadcrumbs,
          'pointer flex flex-row items-center pa5 bg-base w-100 z-max bb b--muted-4'
        )}
      >
        <div
          role="button"
          tabIndex={0}
          className={`${handles.filterBreadcrumbsContent} pv4 flex items-center`}
          onClick={() => setOpenItem(null)}
          onKeyDown={handleKeyDown}
        >
          <div
            className={classNames(
              `${handles.filterBreadcrumbsText} t-heading-4`,
              {
                'c-muted-2': openItem,
                'c-on-base': !openItem,
              }
            )}
          >
            {intl.formatMessage({
              id: 'store/search-result.filter-breadcrumbs.primary',
            })}
          </div>
        </div>
        {openItem && (
          <div
            className={`${handles.filterBreadcrumbsItem} pv4 flex items-center`}
          >
            <IconCaret orientation="right" size={13} />
            <div
              className={`${handles.filterBreadcrumbsItemName} pl3 t-heading-4 c-on-base`}
            >
              {intl.formatMessage({ id: openItem })}
            </div>
          </div>
        )}
      </div>

      {tree.length > 0 && (
        <AccordionFilterItem
          title={CATEGORIES_TITLE}
          open={departmentsOpen}
          show={!openItem || departmentsOpen}
          onOpen={handleOpen(CATEGORIES_TITLE)}
          appliedFiltersOverview={appliedFiltersOverview}
          navigationType={navigationType}
          initiallyCollapsed={initiallyCollapsed}
          onClearFilter={onClearFilter}
        >
          <div className={itemClassName}>
            <DepartmentFilters
              tree={tree}
              isVisible={tree.length > 0}
              onCategorySelect={onCategorySelect}
              hideBorder
            />
          </div>
        </AccordionFilterItem>
      )}

      {nonEmptyFilters.map(filter => {
        const { type, title } = filter
        const isOpen = openItem === filter.title

        switch (type) {
          case 'PriceRanges':
            return (
              <AccordionFilterPriceRange
                title={filter.title}
                facets={filter.facets}
                key={title}
                className={itemClassName}
                open={isOpen}
                show={!openItem || isOpen}
                onOpen={handleOpen(title)}
                onFilterCheck={onFilterCheck}
                priceRange={priceRange}
                navigationType={navigationType}
                initiallyCollapsed={initiallyCollapsed}
              />
            )
          default:
            return (
              <AccordionFilterGroup
                title={filter.title}
                facets={filter.facets}
                key={title}
                className={itemClassName}
                open={isOpen}
                show={!openItem || isOpen}
                onOpen={handleOpen(title)}
                onFilterCheck={onFilterCheck}
                appliedFiltersOverview={appliedFiltersOverview}
                navigationType={navigationType}
                initiallyCollapsed={initiallyCollapsed}
                truncateFilters={truncateFilters}
                onClearFilter={onClearFilter}
                showClearByFilter={showClearByFilter}
              />
            )
        }
      })}
      {showOverlay && (
        <div
          style={{ background: 'rgba(3, 4, 78, 0.4)' }}
          className={classNames(
            handles.filterLoadingOverlay,
            'fixed dim top-0 w-100 vh-100 left-0 z-9999 justify-center items-center justify-center items-center flex'
          )}
        >
          <Spinner />
        </div>
      )}
    </div>
  )
}

AccordionFilterContainer.propTypes = {
  /** Current available filters */
  filters: PropTypes.arrayOf(PropTypes.object),
  /** Intl instance */
  intl: intlShape,
  /** Filters mapped for checkbox */
  filtersChecks: PropTypes.object,
  /** Checkbox hit callback function */
  onFilterCheck: PropTypes.func,
  /** Current price range filter query parameter */
  priceRange: PropTypes.string,
  tree: PropTypes.any,
  onCategorySelect: PropTypes.func,
  /** Whether an overview of the applied filters should be displayed (`"show"`) or not (`"hide"`). */
  appliedFiltersOverview: PropTypes.string,
  /** Defines the navigation method: 'page' or 'collapsible' */
  navigationType: PropTypes.oneOf(['page', 'collapsible']),
  /** Makes the search filters start out collapsed (`true`) or open (`false`) */
  initiallyCollapsed: PropTypes.bool,
  /** If filters start truncated */
  truncateFilters: PropTypes.bool,
  loading: PropTypes.bool,
  /** Clear filter function */
  onClearFilter: PropTypes.func,
  /** Whether a clear button that clear all options in a specific filter should appear beside the filter's name (true) or not (false). */
  showClearByFilter: PropTypes.bool,
  /** Wether the search will be updated on facet selection (`true`) or not (`false`) when the user is on mobile. */
  updateOnFilterSelectionOnMobile: PropTypes.bool,
}

export default injectIntl(AccordionFilterContainer)