import React from 'react'
import PropTypes from 'prop-types'

/**
 * Arrow icon component in svg
 */
const Arrow = ({ size, fillColor }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width={size}
      height={size}
      viewBox="0 0 11 6"
      fill="none"
      color={fillColor}
    >
      <use href="#arrow-up-search-result" xlinkHref="arrow-up-search-result" />
    </svg>
  )
}

Arrow.propTypes = {
  /* Percentage size of the icon */
  size: PropTypes.number,
  /* Fill color for the icon */
  fillColor: PropTypes.string,
}

Arrow.defaultProps = {
  size: 20,
  fillColor: '#3F3F40',
}

export default Arrow