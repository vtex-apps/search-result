import React from 'react'

import AccordionFilterItem from './AccordionFilterItem'
import FacetCheckboxList from './FacetCheckboxList'
import useSelectedFilters from '../hooks/useSelectedFilters'

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
  return (
    <AccordionFilterItem title={title} open={open} show={show} onOpen={onOpen}>
      <div className={className}>
        <FacetCheckboxList onFilterCheck={onFilterCheck} facets={filters} />
      </div>
    </AccordionFilterItem>
  )
}

export default AccordionFilterGroup
