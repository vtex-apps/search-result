import React from 'react'
import PropTypes from 'prop-types'

export default function Check({ size }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width={size}
      height={size}
      viewBox="0 0 9 9"
      fill="none"
    >
      <use href="#check" xlinkHref="#check" />
    </svg>
  )
}

Check.propTypes = {
  size: PropTypes.number,
}

Check.defaultProps = {
  size: 9,
}
