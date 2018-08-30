import React from 'react'
import PropTypes from 'prop-types'

export default function RangeCircle({ style, onDragStart, position, active, disabled, value }) {
  return (
    <div
      className="vtex-range__circle-container absolute pointer z-1 pv4"
      onMouseDown={onDragStart(position)}
      onTouchStart={onDragStart(position)}
      style={{
        ...style,
        willChange: 'transform',
        top: 3,
      }}
    >
      {active && (
        <div
          className="absolute"
          style={{
            left: '50%',
            bottom: '100%',
          }}
        >
          <div
            className="vtex-range__tooltip flex justify-center items-center bg-action-primary white relative ph2 pv1 br1"
            style={{ left: '-50%' }}
          >
            {value}
          </div>
        </div>
      )}
      <div
        className={`vtex-range__circle ba ${active && !disabled ? 'b--action-primary' : 'b--muted-4 hover-b--muted-3'} br-100 bg-white`}
        style={{
          height: '1.25rem',
          width: '1.25rem',
          borderWidth: 3,
        }}
      />
    </div>
  )
}

RangeCircle.defaultProps = {
  active: false,
  disabled: false,
  value: 0,
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
  value: PropTypes.number,
}
