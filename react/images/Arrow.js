import React from 'react'
import PropTypes from 'prop-types'
import Icon from 'vtex.use-svg/Icon'

const defaultSize = {
  width: 14,
  height: 10,
}

const Arrow = ({ up, size }) => {
  const width = size

  const ratio = width / defaultSize.width
  const height = defaultSize.height * ratio

  const iconId = up ? 'arrow-up' : 'arrow-down'

  return (
    <Icon id={iconId} size={size} viewBox='0 0 14 10'/>
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
