import React from 'react'
import { Button } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'

import searchResult from '../../searchResult.css'

const FetchPreviousButton = props => {
  const { products, from, onFetchPrevious, fetchMoreLoading } = props
  return (
    <div className={`${searchResult.buttonShowMore} w-100 flex justify-center`}>
      {!!products && from > 0 && products.length > 0 && (
        <Button
          onClick={onFetchPrevious}
          isLoading={fetchMoreLoading}
          size="small"
        >
          <FormattedMessage id="store/search-result.show-previous-button" />
        </Button>
      )}
    </div>
  )
}

export default FetchPreviousButton
