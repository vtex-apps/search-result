import React from 'react'
import { bool, string } from 'prop-types'
import Use from 'vtex.use-svg/Use'
import Svg from 'vtex.use-svg/Svg'

const GridIcon = ({ active, activeClassName, muttedClassName, width, height, fill, iconID }) => (  
  <Svg
    width={width}
    height={height}
    viewBox={`0 0 ${width} ${height}`}
    fill={fill}
    className={active ? activeClassName : muttedClassName}
  >
    <Use id={iconID}/>
  </Svg>
)

GridIcon.defaultProps = {
  active: false,
  activeClassName: 'mid-gray',
  muttedClassName: 'light-gray',
  width: '19',
  height: '19',
  fill: 'none',
}

GridIcon.propTypes = {
  /** Whether the icon is active */
  active: bool,
  activeClassName: string,
  muttedClassName: string,
  width: string,
  height: string,
  fill: string,
  iconID: string.isRequired
}

export default GridIcon