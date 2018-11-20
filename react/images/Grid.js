import React from 'react'
import { bool, string } from 'prop-types'
import Use from 'vtex.use-svg/Use'
import Svg from 'vtex.use-svg/Svg'

const Grid = ({ active, activeClassName, muttedClassName, width, height, fill }) => (  
  <Svg
    width={width}
    height={height}
    viewBox={`0 0 ${width} ${height}`}
    fill={fill}
    className={active ? activeClassName : muttedClassName}
  >
    <Use id="grid" />
  </Svg>
)

Grid.defaultProps = {
  active: false,
  activeClassName: 'mid-gray',
  muttedClassName: 'light-gray',
  width: '16',
  height: '19',
  fill: 'none',
}

Grid.propTypes = {
  /** Whether the icon is active */
  active: bool,
  activeClassName: string,
  muttedClassName: string,
  width: string,
  height: string,
  fill: string
}

export default Grid;