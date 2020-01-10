import React from 'react'
import { useSpring, animated } from 'react-spring/web.cjs'

import useMeasure from '../hooks/useMeasure'

const AnimatedDiv = ({ open, containerRef, children }) => {
  const { height } = useMeasure(containerRef)
  const styles = useSpring({ height: open ? height : 0 })
  return (
    <animated.div style={{ overflow: 'hidden', ...styles }}>
      {children}
    </animated.div>
  )
}

export default AnimatedDiv
