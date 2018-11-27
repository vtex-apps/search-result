import React from 'react'
import PropTypes from 'prop-types'
import Icon from 'vtex.use-svg/Icon'

const Arrow = ({ up, size }) => {

  const iconId = up ? 'arrow-up' : 'arrow-down'

  return (
    <Icon id={iconId} size={size} />
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
