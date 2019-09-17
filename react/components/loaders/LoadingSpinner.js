import React from 'react'
import { Spinner } from 'vtex.styleguide'

const LoadingSpinner = props => {
  const { fetchMoreLoading } = props
  return (
    <div>
      {fetchMoreLoading && (
        <div className="w-100 flex justify-center">
          <div className="w3 ma0">
            <Spinner />
          </div>
        </div>
      )}
    </div>
  )
}

export default LoadingSpinner