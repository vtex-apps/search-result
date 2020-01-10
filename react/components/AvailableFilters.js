import React from 'react'
import PropTypes from 'prop-types'

import SearchFilter from './SearchFilter'
import PriceRange from './PriceRange'

const AvailableFilters = ({
  filters = [],
  queryArgs = {},
  priceRange,
  preventRouteChange = false,
  initiallyCollapsed = false,
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
            queryArgs={queryArgs}
            oneSelectedCollapse={oneSelectedCollapse}
            preventRouteChange={preventRouteChange}
            initiallyCollapsed={initiallyCollapsed}
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
  preventRouteChange: PropTypes.bool,
  initiallyCollapsed: PropTypes.bool,
}

export default AvailableFilters
