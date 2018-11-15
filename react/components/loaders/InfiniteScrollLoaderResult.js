import React from 'react'
import { Spinner } from 'vtex.styleguide'
import InfiniteScroll from 'react-infinite-scroll-component'

import { loaderPropTypes } from '../../constants/propTypes'
import SearchResult from '../SearchResult'

/**
 * Search Result Component.
 */
const InfiniteScrollLoaderResult = props => {
  const {
    to,
    maxItemsPerPage,
    onFetchMore,
    recordsFiltered,
    fetchMoreLoading,
    products,
  } = props

  return (
    <InfiniteScroll
      dataLength={products.length}
      next={onFetchMore}
      hasMore={products.length < recordsFiltered}
    >
      <SearchResult {...props}>
        {fetchMoreLoading && (
          <div className="w-100 flex justify-center">
            <div className="w3 ma0">
              <Spinner />
            </div>
          </div>
        )}
      </SearchResult>
    </InfiniteScroll>
  )
}

InfiniteScrollLoaderResult.propTypes = loaderPropTypes

export default InfiniteScrollLoaderResult
