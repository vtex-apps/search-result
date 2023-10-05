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
  onClearFilter,
  showClearByFilter,
  onChangePriceRange,
}) => {
  const priceRangeRegex = /^(.*) TO (.*)$/
  const isPriceRangeSelected = priceRange && priceRangeRegex.test(priceRange)

  return (
    <AccordionFilterItem
      title={title}
      open={open}
      show={show}
      onOpen={onOpen}
      navigationType={navigationType}
      initiallyCollapsed={initiallyCollapsed}
      showClearByFilter={showClearByFilter}
      quantity={isPriceRangeSelected ? 1 : undefined}
      onClearFilter={onClearFilter}
    >
      <div className={className}>
        <PriceRange
          title={title}
          facets={facets}
          priceRange={priceRange}
          priceRangeLayout={priceRangeLayout}
          onChangePriceRange={onChangePriceRange}
        />
      </div>
    </AccordionFilterItem>
  )
}

export default AccordionFilterPriceRange
