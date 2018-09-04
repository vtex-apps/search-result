import React from 'react'
import PropTypes from 'prop-types'

import RangeDragIcon from './RangeDragIcon'

export default function RangeSelector({ className, style, onDragStart, position, active, disabled, value }) {
  return (
    <div
      className={`vtex-range__circle-container absolute pointer z-1 pv4 ${className}`}
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
        className={`vtex-range__circle ba ${active && !disabled ? 'b--action-primary bg-action-primary' : 'b--muted-4 hover-b--muted-3'} br-100 bg-white flex justify-center items-center`}
        style={{
          height: '1.25rem',
          width: '1.25rem',
          borderWidth: 1,
        }}
      >
        <RangeDragIcon />
      </div>
    </div>
  )
}

RangeSelector.defaultProps = {
  active: false,
  disabled: false,
  value: 0,
  className: '',
}

RangeSelector.propTypes = {
  /** CSS classes */
  className: PropTypes.string,
  /** Position of the selector */
  position: PropTypes.oneOf([
    'left',
    'right',
  ]).isRequired,
  /** Style */
  style: PropTypes.object,
  /** onDragStart event */
  onDragStart: PropTypes.func.isRequired,
  /** If the selector is active */
  active: PropTypes.bool,
  /** If the selector is disabled */
  disabled: PropTypes.bool,
  /** Current value of the selector */
  value: PropTypes.number,
}
