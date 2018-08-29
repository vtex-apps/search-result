import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import RangeCircle from './RangeCircle'

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
    min: PropTypes.number,
    max: PropTypes.number,
    onChange: PropTypes.func,
    step: PropTypes.number,
    disabled: PropTypes.bool,
  }

  static defaultProps = {
    min: 0,
    max: 10,
    step: 1,
    onChange: () => {},
  }

  sliderRef = React.createRef()

  state = {
    dragging: null,
    translate: {
      left: 0,
      right: 0,
    },
    values: {
      left: this.props.min,
      right: this.props.max,
    },
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateLayout)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateLayout)
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
      value = this.state.values.right
    } else if (position === 'right' && value <= this.state.values.left) {
      value = this.state.values.left
    }

    return value
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
  }

  handleDrag = position => e => {
    e.preventDefault()

    const slider = this.sliderRef.current
    const rect = slider.getBoundingClientRect()

    const xPos = getPageX(e) - rect.left

    const percentageComplete = xPos / rect.width

    const value = this.getValueForPercent(percentageComplete, position)

    this.updatePositionForValue(value, position)
  }

  updatePositionForValue = (value, position) => {
    const { max, min } = this.props
    const rect = this.sliderRef.current.getBoundingClientRect()
    const percentageComplete = (value - min) / (max - min)

    let translatePx = percentageComplete * rect.width

    if (position === 'right') {
      translatePx = rect.width - translatePx
    }

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
    const { disabled } = this.props
    const { left, right } = this.state.translate

    return (
      <div className="vtex-range w-100 relative pv4">
        <div
          ref={this.sliderRef}
          className="vtex-range__base w-100 bg-light-gray absolute"
          style={{
            height: 3,
            top: '50%',
          }}
        >
          <div
            className={classNames('absolute', {
              'bg-action-primary': !disabled,
              'bg-marked-4': disabled,
            })}
            style={{
              height: 3,
              left,
              right,
            }}
          />
        </div>
        <RangeCircle
          style={{
            transform: `translateX(${left}px) translateX(-50%)`,
            left: 0,
          }}
          onDragStart={this.handleDragStart}
          position="left"
          active={this.state.dragging === 'left'}
        />
        <RangeCircle
          style={{
            transform: `translateX(-${right}px) translateX(50%)`,
            right: 0,
          }}
          onDragStart={this.handleDragStart}
          position="right"
          active={this.state.dragging === 'right'}
        />
      </div>
    )
  }
}
