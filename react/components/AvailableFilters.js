import React from 'react'
import PropTypes from 'prop-types'

import { PRICE_RANGES_TYPE } from '../FilterNavigator'
import SearchFilter from './SearchFilter'
import PriceRange from './PriceRange'

const AvailableFilters = ({ filters = [], priceRange }) =>
  filters.map(filter => {
    const { type, title, facets, oneSelectedCollapse = false } = filter

    switch (type) {
      case PRICE_RANGES_TYPE:
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
  /** Price range query parameter */
  priceRange: PropTypes.string,
}

export default AvailableFilters
