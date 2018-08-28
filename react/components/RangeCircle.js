import React from 'react'
import PropTypes from 'prop-types'

export default function RangeCircle({ style, onDragStart, position }) {
  return (
    <div
      className="vtex-range__circle ba b--muted-4 hover-b--muted-3 br-100 pointer absolute top-0 bottom-0 bg-white"
      style={{
        ...style,
        height: '1.25rem',
        width: '1.25rem',
        borderWidth: 3,
      }}
      onMouseDown={onDragStart(position)}
      onTouchStart={onDragStart(position)}
    />
  )
}

RangeCircle.propTypes = {
  position: PropTypes.oneOf([
    'left',
    'right',
  ]).isRequired,
  style: PropTypes.object,
  onDragStart: PropTypes.func.isRequired,
}
