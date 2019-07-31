import React from 'react'
import PropTypes from 'prop-types'

import SearchFilter from './SearchFilter'
import PriceRange from './PriceRange'

const AvailableFilters = ({
  filters = [],
  priceRange,
  preventRouteChange = false,
}) =>
  filters.map(filter => {
    const { type, title, facets, oneSelectedCollapse = false } = filter

    switch (type) {
      case 'PriceRanges':
        return (
          <PriceRange
            key={title}
            title={title}
            facets={facets}
            priceRange={priceRange}
          />
        )
      default:
        return (
          <SearchFilter
            key={title}
            title={title}
            facets={facets}
            preventRouteChange={preventRouteChange}
            oneSelectedCollapse={oneSelectedCollapse}
          />
        )
    }
  })

AvailableFilters.propTypes = {
  /** Filters to be displayed */
  filters: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      type: PropTypes.string,
      oneSelectedCollapse: PropTypes.bool,
    })
  ),
  /** Prevents changing route when setting filters (uses URL search params instead) */
  preventRouteChange: PropTypes.bool,
  /** Price range query parameter */
  priceRange: PropTypes.string,
}

export default AvailableFilters
