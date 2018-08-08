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

    const pathStyle = !up ? {} : {
      transform: 'translate(14 9.23999) rotate(180)',
    }

    return (
      <svg width={width} height={height} viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          {...pathStyle}
          d="M7.72356 8.48154C7.32958 8.89452 6.67042 8.89452 6.27644 8.48154L0 1.90235L1.81481 0L7 5.43529L12.1852 0L14 1.90235L7.72356 8.48154Z"
          fill="#BDBDBD"
        />
      </svg>
    )
  }
}
