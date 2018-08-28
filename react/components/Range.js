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

    console.log(this.state)

    const { min, max, step } = this.props
    const slider = this.sliderRef.current
    const rect = slider.getBoundingClientRect()

    const xPos = e.pageX - rect.left

    const percentageComplete = xPos / rect.width

    const value = quantize(min + percentageComplete * (max - min), step)
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
      <div className="vtex-range w-100 relative pv3">
        <div
          ref={this.sliderRef}
          className="vtex-range__base w-100 bg-light-gray"
          style={{ height: 3 }}
        />
        <RangeCircle
          style={{
            transform: `translateX(${left}px)`,
            left: 0,
          }}
          onDragStart={this.handleDragStart}
          position="left"
        />
        <RangeCircle
          style={{
            transform: `translateX(-${right}px)`,
            right: 0,
          }}
          onDragStart={this.handleDragStart}
          position="right"
        />
      </div>
    )
  }
}
