import React, { useState } from 'react'
import PropTypes from 'prop-types'

import SearchFilter from './SearchFilter'
import PriceRange from './PriceRange'

const AvailableFilters = ({
  filters = [],
  priceRange,
  preventRouteChange = false,
  initiallyCollapsed = false,
  navigateToFacet,
  keepOneFilterOpened = false,
}) => {
  const [open, setOpen] = useState({})

  return filters.map(filter => {
    const { type, title, facets, oneSelectedCollapse = false } = filter

    switch (type) {
      case 'PriceRanges':
        return (
          <PriceRange
            key={title}
            title={title}
            facets={facets}
            priceRange={priceRange}
            preventRouteChange={preventRouteChange}
          />
        )
      default:
        return (
          <SearchFilter
            key={title}
            title={title}
            facets={facets}
            oneSelectedCollapse={oneSelectedCollapse}
            preventRouteChange={preventRouteChange}
            initiallyCollapsed={initiallyCollapsed}
            navigateToFacet={navigateToFacet}
            keepOneFilterOpened={keepOneFilterOpened}
            open={open}
            setOpen={setOpen}
          />
        )
    }
  })
}

AvailableFilters.propTypes = {
  /** Filters to be displayed */
  filters: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      type: PropTypes.string,
      oneSelectedCollapse: PropTypes.bool,
    })
  ),
  /** Price range query parameter */
  priceRange: PropTypes.string,
  /** Prevent route changes */
  preventRouteChange: PropTypes.bool,
  initiallyCollapsed: PropTypes.bool,
  keepOneFilterOpened: PropTypes.bool
}

export default AvailableFilters
