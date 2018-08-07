import React from 'react'
import PropTypes from 'prop-types'

import SearchFilter from './SearchFilter'
import { mountOptions } from '../constants/SearchHelpers'

const AvailableFilters = ({ filters, map, rest, getLinkProps }) => (
  filters.map(filter => {
    const { type, title, options, oneSelectedCollapse = false } = filter

    return (
      <SearchFilter
        key={title}
        title={title}
        options={mountOptions(options, type, map, rest)}
        oneSelectedCollapse={oneSelectedCollapse}
        type={type}
        getLinkProps={getLinkProps}
      />
    )
  })
)

AvailableFilters.propTypes = {
  filters: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    type: PropTypes.string,
    rest: PropTypes.string,
    oneSelectedCollapse: PropTypes.bool,
  })),
  map: PropTypes.string,
  rest: PropTypes.string,
  getLinkProps: PropTypes.func,
}

AvailableFilters.defaultProps = {
  filters: [],
}

export default AvailableFilters
