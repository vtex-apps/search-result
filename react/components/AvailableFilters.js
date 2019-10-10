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
  /** Price range query parameter */
  priceRange: PropTypes.string,
  /** Prevent route changes */
  preventRouteChange: PropTypes.boolean,
}

export default AvailableFilters
