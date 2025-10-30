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

export const RadioGroup = ({ options = [], value, onChange, ...props }) => (
  <div data-testid={props['data-testid'] || 'radio-group'}>
    {options.map(option => (
      <label key={option.id}>
        <input
          type="radio"
          name={props.name}
          value={option.value}
          checked={value === option.value}
          disabled={option.disabled}
          onChange={e => onChange && onChange({ currentTarget: e.target })}
        />
        {option.label}
      </label>
    ))}
  </div>
)

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

export const Toggle = ({ checked, disabled, label, onChange, ...props }) => (
  <div data-testid={props['data-testid'] || 'toggle'}>
    <label>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={e => onChange && onChange(e.target.checked)}
      />
      {label}
    </label>
  </div>
)
