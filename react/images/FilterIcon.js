import React from 'react'
import PropTypes from 'prop-types'

/**
 * Filter icon component in svg
 */
const FilterIcon = ({ size, fillColor }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width={size}
      height={size}
      viewBox="0 0 17 17"
      fill="none"
      color={fillColor}
    >
      <use href="#search-result-filter" xlinkHref="#search-result-filter" />
    </svg>
  )
}

FilterIcon.propTypes = {
  /* Percentage size of the icon */
  size: PropTypes.number,
  /* Fill color for the icon */
  fillColor: PropTypes.string,
}

FilterIcon.defaultProps = {
  size: 20,
  fillColor: 'currentColor',
}

export default FilterIcon