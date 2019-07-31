import React from 'react'

import AccordionFilterItem from './AccordionFilterItem'
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
  return (
    <AccordionFilterItem title={title} open={open} show={show} onOpen={onOpen}>
      <div className={className}>
        <PriceRange title={title} facets={facets} priceRange={priceRange} />
      </div>
    </AccordionFilterItem>
  )
}

export default AccordionFilterPriceRange
