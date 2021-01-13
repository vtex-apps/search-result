import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useIntl } from 'react-intl'
import classNames from 'classnames'
import { IconCaret } from 'vtex.store-icons'

import AccordionFilterItem from './AccordionFilterItem'
import searchResult from './searchResult.css'

const AccordionFilterContainer = ({
  filters,
  onFilterCheck,
  isOptionSelected,
}) => {
  const intl = useIntl()
  const [openItem, setOpenItem] = useState(null)

  const handleOpen = (id) => (e) => {
    e.preventDefault()

    if (openItem === id) {
      setOpenItem(null)
    } else {
      setOpenItem(id)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === ' ') {
      setOpenItem(null)
    }
  }

  const nonEmptyFilters = filters.filter((spec) => spec.facets.length > 0)

  return (
    <div className={`${searchResult.accordionFilter} h-100`}>
      <div
        className={`${searchResult.filterAccordionBreadcrumbs} pointer flex flex-row items-center pa5 bg-base w-100 z-max bb b--muted-4`}
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

      {nonEmptyFilters.map((filter) => {
        const { title, facets } = filter
        const isOpen = openItem === filter.title

        return (
          <AccordionFilterItem
            key={filter.title}
            title={title}
            facets={facets}
            isOptionSelected={isOptionSelected}
            open={isOpen}
            onFilterCheck={onFilterCheck}
            show={!openItem || isOpen}
            onOpen={handleOpen(filter.title)}
          />
        )
      })}
    </div>
  )
}

AccordionFilterContainer.propTypes = {
  /** Current available filters */
  filters: PropTypes.arrayOf(PropTypes.object),
  /** Filters mapped for checkbox */
  filtersChecks: PropTypes.object,
  /** Checkbox hit callback function */
  onFilterCheck: PropTypes.func,
  /** Filters selected previously */
  selectedFilters: PropTypes.array,
  isOptionSelected: PropTypes.func.isRequired,
}

export default AccordionFilterContainer
