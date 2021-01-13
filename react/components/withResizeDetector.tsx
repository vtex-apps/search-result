import React, { ComponentType } from 'react'
import ReactResizeDetector from 'react-resize-detector'

interface WrappedComponentProps {
  width: number
}

function withResizeDetector<P extends WrappedComponentProps>(
  WrappedComponent: ComponentType<P>
): ComponentType<P> {
  return (props) => (
    <ReactResizeDetector handleWidth>
      {(width: number) => <WrappedComponent {...props} width={width} />}
    </ReactResizeDetector>
  )
}

export default withResizeDetector
