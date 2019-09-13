import React from 'react'
import { Button } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'
import { Spinner } from 'vtex.styleguide'
import InfiniteScroll from 'react-infinite-scroll-component'

import { loaderPropTypes } from '../../constants/propTypes'
import SearchResult from '../SearchResult'
import searchResult from '../../searchResult.css'

/**
 * Search Result Component.
 */
const InfiniteScrollLoaderResult = props => {
  const {
    onFetchMore,
    onFetchPrevious,
    recordsFiltered,
    fetchMoreLoading,
    products,
    children,
    from,
    to,
  } = props

  const fetchPreviousButton = (
    <div className={`${searchResult.buttonShowMore} w-100 flex justify-center`}>
      {!!products && from > 0 && (
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

  const loadingSpinner = (
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

  return (
    <InfiniteScroll
      style={{ overflow: 'none' }}
      dataLength={products.length}
      next={onFetchMore}
      hasMore={to + 1 < recordsFiltered}
      useWindow={false}
    >
      {children || (
        <SearchResult
          {...props}
          fetchPreviousButton={fetchPreviousButton}
          fetchNextButton={loadingSpinner}
        />
      )}
    </InfiniteScroll>
  )
}

InfiniteScrollLoaderResult.propTypes = loaderPropTypes

export default InfiniteScrollLoaderResult
