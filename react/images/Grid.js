import React from 'react'
import PropTypes from 'prop-types'

export default function Grid({ active }) {
  const color = active ? '#828282' : '#ececec'

  return (
    <svg width="16" height="19" viewBox="0 0 16 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="6.73684" height="7" fill={color} />
      <rect x="9.2627" width="6.73684" height="7" fill={color} />
      <rect width="6.73684" height="1" transform="matrix(1 0 0 -1 9.2627 9)" fill={color} />
      <rect width="6.73684" height="1" transform="matrix(1 0 0 -1 0 9)" fill={color} />
      <rect y="10" width="6.73684" height="7" fill={color} />
      <rect x="9.2627" y="10" width="6.73684" height="7" fill={color} />
      <rect width="6.73684" height="1" transform="matrix(1 0 0 -1 9.2627 19)" fill={color} />
      <rect width="6.73684" height="1" transform="matrix(1 0 0 -1 0 19)" fill={color} />
    </svg>
  )
}

Grid.propTypes = {
  /** Whether the icon is active */
  active: PropTypes.bool,
}
