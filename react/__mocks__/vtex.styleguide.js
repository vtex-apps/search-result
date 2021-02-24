/* eslint-disable react/prefer-stateless-function */
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
    return (
      <div>
        <input
          id={this.props.id}
          type="checkbox"
          onChange={this.props.onChange}
          data-testid={`check-specification-${this.props.id}`}
          checked={this.props.checked}
        />
        <label htmlFor={this.props.id}>{this.props.label}</label>
      </div>
    )
  }
}

export function IconCaret() {
  return <div>IconCaretLeft</div>
}

export function IconClose() {
  return <div data-testid="remove-category">IconClose</div>
}

export function Tag({ children, onClick }) {
  return <button onClick={onClick}>{children}</button>
}

export function Input(props) {
  return <input {...props} />
}

export function Slider({ onChange, formatValue, defaultValues }) {
  return (
    <div>
      Slider
      <button onClick={() => onChange([0, 1])}>{`${formatValue(
        defaultValues[0]
      )} ${formatValue(defaultValues[1])}`}</button>
    </div>
  )
}

export const Button = ({ children, onClick }) => (
  <button onClick={onClick}>{children}</button>
)
