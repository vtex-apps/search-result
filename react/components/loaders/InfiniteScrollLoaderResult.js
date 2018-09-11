import React, { Component } from 'react'
import { Spinner } from 'vtex.styleguide'
import InfiniteScroll from 'react-infinite-scroll-component'

import { loaderPropTypes } from '../../constants/propTypes'
import SearchResult from "../SearchResult";

/**
 * Search Result Component.
 */
export default class InfiniteScrollLoaderResult extends Component {
  render() {
    const {
      to,
      onSetFetchMoreLoading,
      maxItemsPerPage,
      products,
      fetchMore,
      onFetchMoreProducts,
      recordsFiltered,
      fetchMoreLoading,
    } = this.props

    return (
      <InfiniteScroll
        dataLength={products.length}
        next={() => {
          onSetFetchMoreLoading(true)

          return fetchMore({
            variables: {
              from: to,
              to: to + maxItemsPerPage - 1,
            },
            updateQuery: onFetchMoreProducts,
          })
        }}
        hasMore={products.length < recordsFiltered}
      >
        <SearchResult {...this.props}>
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
}

InfiniteScrollLoaderResult.propTypes = loaderPropTypes
