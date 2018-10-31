import React, { Component } from 'react'
import PropTypes from 'prop-types'

const defaultSize = {
  width: 14,
  height: 10,
}

export default class Arrow extends Component {
  static propTypes = {
    up: PropTypes.bool,
    size: PropTypes.number,
  }

  static defaultProps = {
    up: false,
    size: 14,
  }

  render() {
    const { up, size } = this.props

    const width = size

    const ratio = width / defaultSize.width
    const height = defaultSize.height * ratio

    return (
      <svg width={width} height={height} viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <use href={up ? '#ds-arrow-up' : '#ds-arrow-down'} />
      </svg>
    )
  }
}
