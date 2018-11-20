import React from 'react'
import { string } from 'prop-types'
import Use from 'vtex.use-svg/Use'
import Svg from 'vtex.use-svg/Svg'

const Check = ({ size, fill }) => (
  <Svg
    width={size}
    height={size}
    viewBox={`0 0 ${size} ${size}`}
    fill={fill}
  >
    <Use id="check" />
  </Svg>
)

Check.defaultProps = {
  size: '9',
  fill: 'none'
}

Check.propTypes = {
  size: string,
  fill: string
}

export default Check