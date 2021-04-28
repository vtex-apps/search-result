import React from 'react'
import { jest } from '@jest/globals'

export const useDevice = jest.fn()

export const withDevice = (WrappedComponent) => {
  return function WrappedWithDevice(props) {
    return <WrappedComponent {...props} />
  }
}
