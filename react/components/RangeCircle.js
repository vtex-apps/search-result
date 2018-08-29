import React from 'react'
import PropTypes from 'prop-types'

export default function RangeCircle({ style, onDragStart, position, active, disabled }) {
  return (
    <div
      className={`vtex-range__circle ba ${active && !disabled ? 'b--action-primary' : 'b--muted-4 hover-b--muted-3'} br-100 pointer absolute bg-white z-1`}
      style={{
        ...style,
        height: '1.25rem',
        width: '1.25rem',
        top: 3,
        borderWidth: 3,
        willChange: 'transform',
      }}
      onMouseDown={onDragStart(position)}
      onTouchStart={onDragStart(position)}
    />
  )
}

RangeCircle.defaultProps = {
  active: false,
  disabled: false,
}

RangeCircle.propTypes = {
  position: PropTypes.oneOf([
    'left',
    'right',
  ]).isRequired,
  style: PropTypes.object,
  onDragStart: PropTypes.func.isRequired,
  active: PropTypes.bool,
  disabled: PropTypes.bool,
}
