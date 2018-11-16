import React from 'react'
import PropTypes from 'prop-types'
import Use from 'vtex.use-svg/Use'

export default function SingleItemGrid({ active }) {
  const color = active ? '#828282' : '#ececec'

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="10"
      height="19"
      viewBox="0 0 10 19"
      fill="none"
      color={color}
    >
      <Use id="single-item-grid" />
    </svg>
  )
}

SingleItemGrid.propTypes = {
  /** Whether the icon is active */
  active: PropTypes.bool,
}
