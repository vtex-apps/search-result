import React from 'react'
import { Button } from 'vtex.styleguide'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'

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
            <FormattedMessage id="store/search-result.show-more-button" />
          </Button>
        )}
      </div>
      {showQuantityOnShowMoreButton && (
        <div
          className={`${
            searchResult.showMoreButtonText
          } tc t-small pt3 c-muted-2`}
        >
          <FormattedMessage
            id="store/search-result.show-more-button-text"
            tagName="span"
            values={{
              value: (
                <span className={`${searchResult.showMoreButtonTextValue} b`}>
                  <FormattedMessage
                    id="store/search-result.show-more-button-text-value"
                    values={{
                      productsLoaded: products.length,
                      total: recordsFiltered,
                    }}
                  />
                </span>
              ),
            }}
          />
        </div>
      )}
    </SearchResult>
  )
}

ShowMoreLoaderResult.propTypes = loaderPropTypes

export default ShowMoreLoaderResult
