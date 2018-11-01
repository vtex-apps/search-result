import React from 'react'
import PropTypes from 'prop-types'

const defaultSize = {
  width: 14,
  height: 10,
}

const Arrow = ({ up, size }) => {
  const width = size

  const ratio = width / defaultSize.width
  const height = defaultSize.height * ratio

  const iconId = up ? '#arrow-up' : '#arrow-down'

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width={width}
      height={height}
      viewBox="0 0 14 10"
      fill="none"
    >
      <use href={iconId} xlinkHref={iconId} />
    </svg>
  )
}
Arrow.propTypes = {
  up: PropTypes.bool,
  size: PropTypes.number,
}

Arrow.defaultProps = {
  up: false,
  size: 14,
}

export default Arrow
