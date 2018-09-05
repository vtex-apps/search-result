import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import RangeDragIcon from './RangeDragIcon'

export default function RangeSelector({
  className,
  style,
  onDragStart,
  position,
  active,
  disabled,
  value,
  displayPopup,
  formatValue,
}) {
  const containerClasses = classNames(
    'vtex-range__circle-container absolute pointer pt4',
    className,
    {
      'z-2': active,
      'z-1': !active,
    }
  )

  const dragCircleClasses = classNames(
    'vtex-range__circle ba br-100 bg-white flex justify-center items-center',
    {
      'b--action-primary bg-action-primary': active && !disabled,
      'b--silver b--mid-silver': !active || disabled,
    }
  )

  const popupClasses = classNames(
    'vtex-range__tooltip flex justify-center items-center relative ph3 pv2 br2 f6 ba',
    {
      'vtex-range__tooltip--active bg-action-primary white b--action-primary': active,
      'bg-white b--silver gray': !active,
    }
  )

  return (
    <div
      className={containerClasses}
      onMouseDown={onDragStart(position)}
      onTouchStart={onDragStart(position)}
      style={{
        ...style,
        willChange: 'transform',
        top: 3,
      }}
    >
      {(active || displayPopup) && (
        <div className="absolute" style={{ left: '50%', bottom: '100%' }}>
          <div className={popupClasses} style={{ left: '-50%' }}>
            {formatValue(value)}
          </div>
        </div>
      )}
      <div
        className={dragCircleClasses}
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
  displayPopup: false,
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
  /** Whether the popup is displayed when inactive */
  displayPopup: PropTypes.bool,
  /** Function to format the value */
  formatValue: PropTypes.func.isRequired,
}
