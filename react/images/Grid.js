import React from 'react'
import PropTypes from 'prop-types'

/**
 * Grid icon component in svg
 */
const Grid = ({ size, fillColor }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      color={fillColor}
    >
      <use href="#grid-search-result" xlinkHref="#grid-search-result" />
    </svg>
  )
}

Grid.propTypes = {
  /* Percentage size of the icon */
  size: PropTypes.number,
  /* Fill color for the icon */
  fillColor: PropTypes.string,
}

Grid.defaultProps = {
  size: 20,
  fillColor: '#3F3F40',
}

export default Grid