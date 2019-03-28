import React from 'react'
import PropTypes from 'prop-types'

import { PRICE_RANGES_TYPE } from '../FilterNavigator'
import { mountOptions } from '../constants/SearchHelpers'
import SearchFilter from './SearchFilter'
import PriceRange from './PriceRange'

const AvailableFilters = ({ filters = [], map, priceRange }) =>
  filters.map(filter => {
    const { type, title, options, oneSelectedCollapse = false } = filter

    switch (type) {
      case PRICE_RANGES_TYPE:
        return (
          <PriceRange
            key={title}
            title={title}
            options={options}
            type={type}
            priceRange={priceRange}
          />
        )
      default:
        return (
          <SearchFilter
            key={title}
            title={title}
            facets={mountOptions(options, type, map)}
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
  /** Map query parameter */
  map: PropTypes.string,
  /** Price range query parameter */
  priceRange: PropTypes.string,
}

export default AvailableFilters
