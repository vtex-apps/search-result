import React from 'react'

import AccordionFilterItem from './AccordionFilterItem'
import useSelectedFilters from '../hooks/useSelectedFilters'
import PriceRange from './PriceRange'

const AccordionFilterPriceRange = ({
  className,
  title,
  facets,
  show,
  open,
  onOpen,
  priceRange,
}) => {
  const filters = useSelectedFilters(facets)

  const quantitySelected = filters.filter(facet => facet.selected).length

  return (
    <AccordionFilterItem
      title={title}
      open={open}
      show={show}
      onOpen={onOpen}
      quantitySelected={quantitySelected}
    >
      <div className={className}>
        <PriceRange
          key={title}
          title={title}
          facets={facets}
          priceRange={priceRange}
        />
      </div>
    </AccordionFilterItem>
  )
}

export default AccordionFilterPriceRange
