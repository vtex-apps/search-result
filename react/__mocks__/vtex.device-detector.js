import React from 'react'

export const useDevice = () => {
  return { isMobile: true }
}

export const withDevice = WrappedComponent => {
  return function WrappedWithDevice(props) {
    return <WrappedComponent {...props} />
  }
}
