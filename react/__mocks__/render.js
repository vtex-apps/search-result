import React, { Component } from 'react'
import { PropTypes } from 'prop-types'

/**
 * Link Mocked Component.
 */
export class Link extends Component {
  static propTypes = {
    children: PropTypes.element,
  }

  render() {
    return (
      <a href="#">{this.props.children}</a>
    )
  }
}
