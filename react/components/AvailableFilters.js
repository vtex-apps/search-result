import React from 'react'
import PropTypes from 'prop-types'

import { PRICE_RANGES_TYPE } from '../FilterNavigator'
import { mountOptions } from '../constants/SearchHelpers'
import SearchFilter from './SearchFilter'
import PriceRange from './PriceRange'

const AvailableFilters = ({ filters, map, priceRange, getLinkProps }) =>
  filters.map(filter => {
    const { type, title, options, oneSelectedCollapse = false } = filter

    switch (type) {
      case PRICE_RANGES_TYPE:
        return (
          <PriceRange
            key={title}
            title={title}
            options={options}
            getLinkProps={getLinkProps}
            type={type}
            priceRange={priceRange}
          />
        )
      default:
        return (
          <SearchFilter
            key={title}
            title={title}
            options={mountOptions(options, type, map)}
            oneSelectedCollapse={oneSelectedCollapse}
            type={type}
            getLinkProps={getLinkProps}
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
  /** Get the props to pass to render's Link */
  getLinkProps: PropTypes.func,
  /** Price range query parameter */
  priceRange: PropTypes.string,
}

AvailableFilters.defaultProps = {
  filters: [],
}

export default AvailableFilters
