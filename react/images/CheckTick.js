import React from 'react'
import { string } from 'prop-types'
import Use from 'vtex.use-svg/Use'
import Svg from 'vtex.use-svg/Svg'

const CheckTick = ({ width, height, fill}) => (
  <Svg
    width={width}
    height={height}
    viewBox={`0 0 ${width} ${height}`}      
    fill={fill}
  >
    <Use id="check-tick" />
  </Svg>
)

CheckTick.defaultProps = {
  width: '11',
  height: '9',
  fill: 'none',
}

CheckTick.propTypes = {
  width: string,
  height: string,
  fill: string,
}

export default CheckTick
