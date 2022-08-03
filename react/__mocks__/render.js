import React, { Component } from 'react'
import { PropTypes } from 'prop-types'

/**
 * Link Mocked Component.
 */
// eslint-disable-next-line react/prefer-stateless-function
export class Link extends Component {
  static propTypes = {
    children: PropTypes.element,
  }

  render() {
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    return <a href="#">{this.props.children}</a>
  }
}

export class NoSSR extends Component {
  static propTypes = {
    children: PropTypes.element,
  }

  render() {
    return this.props.children
  }
}

export function withRuntimeContext(Comp) {
  return Comp
}
