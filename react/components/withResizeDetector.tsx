import type { ComponentType } from 'react'
import React from 'react'
import ReactResizeDetector from 'react-resize-detector'

interface WrappedComponentProps {
  width: number
}

function withResizeDetector<P extends WrappedComponentProps>(
  WrappedComponent: ComponentType<P>
): ComponentType<P> {
  // eslint-disable-next-line react/display-name
  return props => (
    <ReactResizeDetector handleWidth>
      {(width: number) => <WrappedComponent {...props} width={width} />}
    </ReactResizeDetector>
  )
}

export default withResizeDetector
