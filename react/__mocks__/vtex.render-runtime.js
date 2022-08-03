import React from 'react'
import { PropTypes } from 'prop-types'

const config = { isMobile: false }

export const withRuntimeContext = Comp => {
  // eslint-disable-next-line react/display-name
  return class extends React.Component {
    runtime = { navigate: jest.fn(), hints: { mobile: config.isMobile } }

    render() {
      return <Comp runtime={this.runtime} {...this.props} />
    }
  }
}

export class NoSSR extends React.Component {
  static propTypes = {
    children: PropTypes.element,
  }

  render() {
    return this.props.children
  }
}

export const setMobileState = isMobile => {
  config.isMobile = isMobile
}

export const useRuntime = jest.fn()

export const ExtensionPoint = ({ id }) => <div> Extension Point: {id} </div>

// eslint-disable-next-line jsx-a11y/anchor-is-valid
export const Link = ({ children }) => <a className="mockedLink">{children}</a>
