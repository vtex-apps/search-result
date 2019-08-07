import React, { Component } from 'react'

export class Dropdown extends Component {
  render() {
    return <div {...this.props}>Dropdown</div>
  }
}

export class Spinner extends Component {
  render() {
    return <div>Spinner</div>
  }
}

export class Checkbox extends Component {
  render() {
    return <div>Checkbox</div>
  }
}

export function IconCaret() {
  return <div>IconCaretLeft</div>
}

export const Button = () => <div>Button</div>
