import React from 'react'
import ReactResizeDetector from 'react-resize-detector'

function withResizeDetector(WrappedComponent) {
  // eslint-disable-next-line react/display-name
  return props => (
    <ReactResizeDetector handleWidth>
      {width => <WrappedComponent {...props} width={width} />}
    </ReactResizeDetector>
  )
}

export default withResizeDetector
