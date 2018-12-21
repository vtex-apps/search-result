import React from 'react'
import { Button } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'

import SearchResult from '../SearchResult'
import { loaderPropTypes } from '../../constants/propTypes'

/**
 * Search Result Component.
 */
const ShowMoreLoaderResult = props => {
  const {
    products,
    recordsFiltered,
    onFetchMore,
    fetchMoreLoading,
  } = props

  return (
    <SearchResult {...props}>
      <div className="vtex-search-result__button--show-more w-100 flex justify-center">
        { (!!products && products.length < recordsFiltered) && (
          <Button
            onClick={onFetchMore}
            isLoading={fetchMoreLoading}
            size="small"
          >
            <FormattedMessage
              id="search-result.show-more-button"
            />
          </Button>)
        }
      </div>
    </SearchResult>
  )
}

ShowMoreLoaderResult.propTypes = loaderPropTypes

export default ShowMoreLoaderResult
