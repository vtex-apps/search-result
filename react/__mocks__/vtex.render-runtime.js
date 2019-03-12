import React, { useState } from 'react'

const config = { isMobile: false }

export const withRuntimeContext = Comp => {
  return class extends React.Component {
    runtime = { navigate: jest.fn(), hints: { mobile: config.isMobile } }

    render() {
      return <Comp runtime={this.runtime} {...this.props} />
    }
  }
}

export const setMobileState = isMobile => {
  config.isMobile = isMobile
}

export const useRuntime = () => {
  const [hints, setHints] = useState({ mobile: false, desktop: true })
  return { hints }
}

export const ExtensionPoint = ({ id }) => <div> Extension Point: {id} </div>

export const Link = ({ children }) => <a className="mockedLink">{children}</a>
