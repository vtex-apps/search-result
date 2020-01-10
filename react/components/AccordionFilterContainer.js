import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import classNames from 'classnames'
import { IconCaret } from 'vtex.store-icons'

import AccordionFilterItem from './AccordionFilterItem'
import DepartmentFilters from './DepartmentFilters'
import AccordionFilterGroup from './AccordionFilterGroup'
import AccordionFilterPriceRange from './AccordionFilterPriceRange'

import styles from '../searchResult.css'

const CATEGORIES_TITLE = 'store/search.filter.title.categories'

const AccordionFilterContainer = ({
  map,
  filters,
  intl,
  onFilterCheck,
  tree,
  onCategorySelect,
  priceRange,
}) => {
  const [openItem, setOpenItem] = useState(null)

  const handleOpen = id => e => {
    e.preventDefault()

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
    'ph5 pt3 h-100 overflow-scroll'
  )

  return (
    <div className={classNames(styles.accordionFilter, 'h-100')}>
      <div
        className={classNames(
          styles.filterAccordionBreadcrumbs,
          'pointer flex flex-row items-center pa5 bg-base w-100 z-max bb b--muted-4'
        )}
      >
        <div
          role="button"
          tabIndex={0}
          className="pv4 flex items-center"
          onClick={() => setOpenItem(null)}
          onKeyDown={handleKeyDown}
        >
          <div
            className={classNames('t-heading-4', {
              'c-muted-2': openItem,
              'c-on-base': !openItem,
            })}
          >
            {intl.formatMessage({
              id: 'store/search-result.filter-breadcrumbs.primary',
            })}
          </div>
        </div>
        {openItem && (
          <div className="pa4 flex items-center">
            <IconCaret orientation="right" size={13} />
            <div className="pl3 t-heading-4 c-on-base">
              {intl.formatMessage({ id: openItem })}
            </div>
          </div>
        )}
      </div>

      <AccordionFilterItem
        title={CATEGORIES_TITLE}
        open={departmentsOpen}
        show={!openItem || departmentsOpen}
        onOpen={handleOpen(CATEGORIES_TITLE)}
      >
        <div className={itemClassName}>
          <DepartmentFilters
            map={map}
            tree={tree}
            isVisible={tree.length > 0}
            onCategorySelect={onCategorySelect}
            hideBorder
          />
        </div>
      </AccordionFilterItem>

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
              />
            )
        }
      })}
    </div>
  )
}

AccordionFilterContainer.propTypes = {
  /** Legacy search map */
  map: PropTypes.string,
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
}

export default injectIntl(AccordionFilterContainer)
