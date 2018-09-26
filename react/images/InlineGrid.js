import React from 'react'
import PropTypes from 'prop-types'

export default function InlineGrid({ active }) {
  const color = active ? '#828282' : '#ececec'

  return (
    <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect y="14" width="5" height="5" fill={color} />
      <rect y="7" width="5" height="5" fill={color} />
      <rect width="5" height="5" fill={color} />
      <rect x="7" width="12" height="2" fill={color} />
      <rect x="7" y="3" width="12" height="2" fill={color} />
      <rect x="7" y="7" width="12" height="2" fill={color} />
      <rect x="7" y="10" width="12" height="2" fill={color} />
      <rect x="7" y="14" width="12" height="2" fill={color} />
      <rect x="7" y="17" width="12" height="2" fill={color} />
    </svg>
  )
}

InlineGrid.propTypes = {
  /** Whether the icon is active */
  active: PropTypes.bool,
}
