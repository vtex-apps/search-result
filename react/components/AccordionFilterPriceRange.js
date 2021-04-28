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
  navigationType,
  initiallyCollapsed,
  priceRangeLayout,
}) => {
  return (
    <AccordionFilterItem
      title={title}
      open={open}
      show={show}
      onOpen={onOpen}
      navigationType={navigationType}
      initiallyCollapsed={initiallyCollapsed}
    >
      <div className={className}>
        <PriceRange
          title={title}
          facets={facets}
          priceRange={priceRange}
          priceRangeLayout={priceRangeLayout}
        />
      </div>
    </AccordionFilterItem>
  )
}

export default AccordionFilterPriceRange
