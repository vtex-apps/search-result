import React from 'react'
import { Spinner } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = [
  'loadingSpinnerOuterContainer',
  'loadingSpinnerInnerContainer',
]

const LoadingSpinner = props => {
  const { loading } = props
  const handles = useCssHandles(CSS_HANDLES)
  return (
    loading && (
      <div
        className={`${handles.loadingSpinnerOuterContainer} w-100 flex justify-center`}
      >
        <div className={`${handles.loadingSpinnerInnerContainer} w3 ma0`}>
          <Spinner />
        </div>
      </div>
    )
  )
}

export default LoadingSpinner
