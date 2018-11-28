import React from 'react'
import PropTypes from 'prop-types'

/**
 * SingleItemGrid icon component in svg
 */
const SingleItemGrid = ({ size, fillColor }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width={size}
      height={size}
      viewBox="0 0 12 17"
      fill="none"
      color={fillColor}
    >
      <use href="#single-item-grid-search-result" xlinkHref="#single-item-grid-search-result" />
    </svg>
  )
}

SingleItemGrid.propTypes = {
  /* Percentage size of the icon */
  size: PropTypes.number,
  /* Fill color for the icon */
  fillColor: PropTypes.string,
}

SingleItemGrid.defaultProps = {
  size: 20,
  fillColor: '#3F3F40',
}

export default SingleItemGrid