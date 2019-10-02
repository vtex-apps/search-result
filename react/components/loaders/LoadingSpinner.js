import React from 'react'
import { Spinner } from 'vtex.styleguide'

const LoadingSpinner = props => {
  const { loading } = props
  return (
    loading && (
      <div className="w-100 flex justify-center">
        <div className="w3 ma0">
          <Spinner />
        </div>
      </div>
    )
  )
}

export default LoadingSpinner
