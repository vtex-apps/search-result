import React from 'react'
import PropTypes from 'prop-types'

export default function Check({ size }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 9 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width="9"
        height="9"
        rx="2"
        fill="#368DF7"
      />
      <path
        d="M4.95 0.7875L4.1625 -5.36442e-08L1.9125 2.25L0.7875 1.125L-5.36442e-08 1.9125L1.9125 3.825L4.95 0.7875Z"
        transform="translate(2.25 2.8125)"
        fill="white"
      />
    </svg>
  )
}

Check.propTypes = {
  size: PropTypes.number,
}

Check.defaultProps = {
  size: 9,
}
