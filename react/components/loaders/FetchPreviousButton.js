import React, { useState, useEffect } from 'react'
import { Button } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'

import searchResult from '../../searchResult.css'

const useShowButton = (from, products, loading) => {
  const [showButton, setShowButton] = useState(
    !!products && from > 0 && products.length > 0
  )
  useEffect(() => {
    if (!loading) {
      setShowButton(!!products && from > 0 && products.length > 0)
    }
  }, [from, products, loading])

  return showButton
}

const FetchPreviousButton = props => {
  const { products, from, onFetchPrevious, loading } = props
  const showButton = useShowButton(from, products, loading)
  return (
    <div className={`${searchResult.buttonShowMore} w-100 flex justify-center`}>
      {showButton && (
        <Button onClick={onFetchPrevious} isLoading={loading} size="small">
          <FormattedMessage id="store/search-result.show-previous-button" />
        </Button>
      )}
    </div>
  )
}

export default FetchPreviousButton
