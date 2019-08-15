import React from 'react'
import { Button } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'

import SearchResult from '../SearchResult'
import { loaderPropTypes } from '../../constants/propTypes'

import searchResult from '../../searchResult.css'

/**
 * Search Result Component.
 */
const ShowMoreLoaderResult = props => {
  const {
    products,
    recordsFiltered,
    onFetchMore,
    fetchMoreLoading,
    showQuantityOnShowMoreButton,
  } = props

  return (
    <SearchResult {...props}>
      <div
        className={`${searchResult.buttonShowMore} w-100 flex justify-center`}
      >
        {!!products && products.length < recordsFiltered && (
          <Button
            onClick={onFetchMore}
            isLoading={fetchMoreLoading}
            size="small"
          >
            {showQuantityOnShowMoreButton ? (
              <FormattedMessage
                id="store/search-result.show-more-button-with-quantity"
                values={{
                  productsLoaded: products.length,
                  total: recordsFiltered,
                }}
              />
            ) : (
              <FormattedMessage id="store/search-result.show-more-button" />
            )}
          </Button>
        )}
      </div>
    </SearchResult>
  )
}

ShowMoreLoaderResult.propTypes = loaderPropTypes

export default ShowMoreLoaderResult
