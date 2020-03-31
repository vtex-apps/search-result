import React from 'react'
import { useIntl } from 'react-intl'

import AccordionFilterItem from './AccordionFilterItem'
import FacetCheckboxList from './FacetCheckboxList'
import useSelectedFilters from '../hooks/useSelectedFilters'

import { getFilterTitle } from '../constants/SearchHelpers'

const AccordionFilterGroup = ({
  className,
  title,
  facets,
  show,
  open,
  onOpen,
  onFilterCheck,
}) => {
  const filters = useSelectedFilters(facets)
  const quantitySelected = filters.filter(facet => facet.selected).length
  const intl = useIntl()
  const facetTitle = getFilterTitle(title, intl)

  return (
    <AccordionFilterItem
      title={title}
      open={open}
      show={show}
      onOpen={onOpen}
      quantitySelected={quantitySelected}
    >
      <div className={className}>
        <FacetCheckboxList
          onFilterCheck={onFilterCheck}
          facets={filters}
          facetTitle={facetTitle}
        />
      </div>
    </AccordionFilterItem>
  )
}

export default AccordionFilterGroup
