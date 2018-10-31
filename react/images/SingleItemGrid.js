import React from 'react'
import PropTypes from 'prop-types'

export default function SingleItemGrid({ active }) {
  const color = active ? '#828282' : '#ececec'

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="10"
      height="19"
      viewBox="0 0 10 19"
      fill="none"
      color={color}
    >
      <use href="#ds-single-item-grid" />
    </svg>
  )
}

SingleItemGrid.propTypes = {
  /** Whether the icon is active */
  active: PropTypes.bool,
}
