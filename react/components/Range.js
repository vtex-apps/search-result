import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { identity } from 'ramda'

import RangeSelector from './RangeSelector'

const UP_EVENTS = ['mouseup', 'pointerup', 'touchend']

const MOVE_EVENT_MAP = {
  'mousedown': 'mousemove',
  'touchstart': 'touchmove',
  'pointerdown': 'pointermove',
}

function quantize(value, step) {
  const numSteps = Math.round(value / step)
  const quantizedVal = numSteps * step

  return quantizedVal
}

function getPageX(evt) {
  if (evt.targetTouches && evt.targetTouches.length > 0) {
    return evt.targetTouches[0].pageX
  }

  return evt.pageX
}

function isEscKeyEvent(evt) {
  return evt.key === 'Escape' || evt.keyCode === 27
}

export default class Range extends Component {
  static propTypes = {
    /** Minimum supported value */
    min: PropTypes.number,
    /** Maximum supported value */
    max: PropTypes.number,
    /** onChange event */
    onChange: PropTypes.func,
    /** Step value */
    step: PropTypes.number,
    /** Whether the slider is disabled */
    disabled: PropTypes.bool,
    /** Initial values */
    initialValues: PropTypes.shape({
      left: PropTypes.number,
      right: PropTypes.number,
    }),
    /** Whether to always display current value as a popup */
    alwaysShowCurrentValue: PropTypes.bool,
    /** Function to format the value shown in popup */
    formatPopupValue: PropTypes.func,
  }

  static defaultProps = {
    min: 0,
    max: 10,
    step: 1,
    onChange: () => {},
    alwaysShowCurrentValue: false,
    formatPopupValue: identity,
  }

  sliderRef = React.createRef()

  state = {
    dragging: null,
    translate: {
      left: 0,
      right: 0,
    },
    values: {
      left: this.props.initialValues && this.props.initialValues.left
        ? this.props.initialValues.left
        : this.props.min,
      right: this.props.initialValues && this.props.initialValues.right
        ? this.props.initialValues.right
        : this.props.max,
    },
  }

  componentDidUpdate(prevProps) {
    if (prevProps.min !== this.props.min || prevProps.max !== this.props.max) {
      this.setState({
        translate: {
          left: 0,
          right: 0,
        },
        values: {
          left: this.props.min,
          right: this.props.max,
        },
      }, this.updateLayout)
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateLayout)

    if (this.props.initialValues && (this.props.initialValues.left || this.props.initialValues.right)) {
      this.updateLayout()
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateLayout)

    if (this.cancelDragEvent_) {
      this.cancelDragEvent_()
    }
  }

  updateLayout = () => {
    this.updatePositionForValue(this.state.values.left, 'left')
    this.updatePositionForValue(this.state.values.right, 'right')
  }

  getValueForPercent = (percentageComplete, position) => {
    const { min, max, step } = this.props

    const rawValue = min + percentageComplete * (max - min)

    let value

    if (rawValue !== min && rawValue !== max) {
      value = quantize(rawValue, step)
    } else {
      value = rawValue
    }

    if (value < min) {
      value = min
    } else if (value > max) {
      value = max
    }

    if (position === 'left' && value >= this.state.values.right) {
      value = this.state.values.right - step
    } else if (position === 'right' && value <= this.state.values.left) {
      value = this.state.values.left + step
    }

    return value
  }

  getTranslateValueForInputValue = (value, position) => {
    const { max, min } = this.props
    const rect = this.sliderRef.current.getBoundingClientRect()
    const percentageComplete = (value - min) / (max - min)

    let translatePx = percentageComplete * rect.width

    if (position === 'right') {
      translatePx = rect.width - translatePx
    }

    return translatePx
  }

  handleDragStart = position => e => {
    if (this.props.disabled) {
      return
    }

    this.setState({
      dragging: position,
    })

    this.valuesBeforeDrag_ = this.state.values

    // https://reactjs.org/docs/events.html#event-pooling
    e.persist()

    const moveHandler = this.handleDrag(position)

    this.cancelDragEvent_ = () => {
      this.valuesBeforeDrag_ = undefined
      UP_EVENTS.forEach(evtName => document.body.removeEventListener(evtName, handleUpEvent))
      document.body.removeEventListener(MOVE_EVENT_MAP[e.type], moveHandler)
      document.body.removeEventListener('keydown', this.handleKeyDown)
    }

    const handleUpEvent = () => {
      this.cancelDragEvent_()
      this.handleDragEnd()
    }

    UP_EVENTS.forEach(evtName => document.body.addEventListener(evtName, handleUpEvent))
    document.body.addEventListener(MOVE_EVENT_MAP[e.type], moveHandler)
    document.body.addEventListener('keydown', this.handleKeyDown)

    this.updatePositionFromEvent(e, position)
  }

  updatePositionFromEvent = (e, position) => {
    const slider = this.sliderRef.current
    const rect = slider.getBoundingClientRect()

    const xPos = getPageX(e) - rect.left

    const percentageComplete = xPos / rect.width

    const value = this.getValueForPercent(percentageComplete, position)

    this.updatePositionForValue(value, position)
  }

  handleDrag = position => e => {
    e.preventDefault()
    this.updatePositionFromEvent(e, position)
  }

  updatePositionForValue = (value, position) => {
    const translatePx = this.getTranslateValueForInputValue(value, position)

    requestAnimationFrame(() => {
      this.setState({
        values: {
          ...this.state.values,
          [position]: value,
        },
        translate: {
          ...this.state.translate,
          [position]: translatePx,
        },
      })
    })
  }

  handleDragEnd = () => {
    this.setState({
      dragging: null,
    })

    this.cancelDragEvent_ = undefined

    this.props.onChange(this.state.values)
  }

  handleKeyDown = evt => {
    if (!isEscKeyEvent(evt) || !this.state.dragging) {
      return
    }

    this.setState({
      dragging: false,
      values: this.valuesBeforeDrag_,
    })

    this.cancelDragEvent_()
    this.cancelDragEvent = undefined

    this.updateLayout()
  }

  render() {
    const { disabled, alwaysShowCurrentValue, formatPopupValue } = this.props
    const { left, right } = this.state.translate

    return (
      <div className="vtex-range w-100 relative pv4" style={{ height: 48 }}>
        <div
          ref={this.sliderRef}
          className="vtex-range__base w-100 bg-silver absolute br-pill overflow-hidden"
          style={{
            height: 10,
            top: 20,
          }}
        >
          <div
            className={classNames('absolute h-100', {
              'bg-gray': !disabled,
              'bg-marked-4': disabled,
            })}
            style={{
              left,
              right,
            }}
          />
        </div>
        <RangeSelector
          className="left-0"
          style={{
            transform: `translateX(${left}px) translateX(-100%)`,
          }}
          onDragStart={this.handleDragStart}
          position="left"
          active={this.state.dragging === 'left'}
          displayPopup={alwaysShowCurrentValue}
          value={this.state.values.left}
          formatValue={formatPopupValue}
        />
        <RangeSelector
          className="right-0"
          style={{
            transform: `translateX(-${right}px) translateX(100%)`,
          }}
          onDragStart={this.handleDragStart}
          position="right"
          active={this.state.dragging === 'right'}
          displayPopup={alwaysShowCurrentValue}
          value={this.state.values.right}
          formatValue={formatPopupValue}
        />
      </div>
    )
  }
}
