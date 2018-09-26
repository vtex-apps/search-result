import React from 'react'
import PropTypes from 'prop-types'

export default function SingleItemGrid({ active }) {
  const color = active ? '#828282' : '#ececec'

  return (
    <svg width="10" height="19" viewBox="0 0 10 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="10" height="14" fill={color} />
      <rect y="16" width="10" height="3" fill={color} />
    </svg>
  )
}

SingleItemGrid.propTypes = {
  /** Whether the icon is active */
  active: PropTypes.bool,
}
