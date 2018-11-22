import React from 'react'
import PropTypes from 'prop-types'

/**
 * InlineGrid icon component in svg
 */
const InlineGrid = ({ size, fillColor }) => {
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
      <use href="#list-grid" xlinkHref="#list-grid" />
    </svg>
  )
}

InlineGrid.propTypes = {
  /* Percentage size of the icon */
  size: PropTypes.number,
  /* Fill color for the icon */
  fillColor: PropTypes.string,
}

InlineGrid.defaultProps = {
  size: 20,
  fillColor: '#3F3F40',
}

export default InlineGrid