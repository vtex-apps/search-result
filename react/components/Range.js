import React, { Component } from 'react'
import PropTypes from 'prop-types'

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

export default class Range extends Component {
  static propTypes = {
    min: PropTypes.number,
    max: PropTypes.number,
    onChange: PropTypes.func,
    step: PropTypes.number,
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
    this.setState({
      dragging: position,
    })

    // https://reactjs.org/docs/events.html#event-pooling
    e.persist()

    const moveHandler = this.handleDrag(position)

    const handleUpEvent = () => {
      this.handleDragEnd()
      UP_EVENTS.forEach(evtName => document.body.removeEventListener(evtName, handleUpEvent))
      document.body.removeEventListener(MOVE_EVENT_MAP[e.type], moveHandler)
    }

    UP_EVENTS.forEach(evtName => document.body.addEventListener(evtName, handleUpEvent))
    document.body.addEventListener(MOVE_EVENT_MAP[e.type], moveHandler)
  }

  handleDrag = position => e => {
    e.preventDefault()

    const { min, max } = this.props
    const slider = this.sliderRef.current
    const rect = slider.getBoundingClientRect()

    const xPos = getPageX(e) - rect.left

    let percentageComplete = xPos / rect.width

    const value = this.getValueForPercent(percentageComplete, position)

    percentageComplete = (value - min) / (max - min)

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
  }

  render() {
    const { left, right } = this.state.translate

    return (
      <div className="vtex-range w-100 relative pv3 overflow-x-visible">
        <div
          ref={this.sliderRef}
          className="vtex-range__base w-100 bg-light-gray"
          style={{ height: 3 }}
        />
        <RangeCircle
          style={{
            transform: `translateX(${left}px) translateX(-50%)`,
            left: 0,
          }}
          onDragStart={this.handleDragStart}
          position="left"
        />
        <RangeCircle
          style={{
            transform: `translateX(-${right}px) translateX(50%)`,
            right: 0,
          }}
          onDragStart={this.handleDragStart}
          position="right"
        />
      </div>
    )
  }
}
