import React from 'react'
import PropTypes from 'prop-types'

export default function Grid({ active }) {
  const color = active ? '#828282' : '#ececec'

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="16"
      height="19"
      viewBox="0 0 16 19"
      fill="none"
      color={color}
    >
      <use href="#grid" xlinkHref="#grid" />
    </svg>
  )
}

Grid.propTypes = {
  /** Whether the icon is active */
  active: PropTypes.bool,
}
