import React, { useState, useRef, useCallback } from 'react'
import { min } from 'ramda'

import { Container } from 'vtex.store-components'

import { PopupProvider } from './Popup'
import InfiniteScrollLoaderResult from './loaders/InfiniteScrollLoaderResult'
import ShowMoreLoaderResult from './loaders/ShowMoreLoaderResult'
import { searchResultContainerPropTypes } from '../constants/propTypes'
import {
  useSearchPageStateDispatch,
  useSearchPageState,
} from 'vtex.search-page-context/SearchPageContext'

const PAGINATION_TYPES = ['show-more', 'infinite-scroll']

const useFetchingMore = () => {
  const [fetchMoreLoading, localSetMore] = useState(false)
  const { isFetchingMore } = useSearchPageState()
  const dispatch = useSearchPageStateDispatch()
  const setFetchMore = useCallback(
    value => {
      dispatch({ type: 'SET_FETCHING_MORE', args: { isFetchingMore: value } })
      localSetMore(value)
    },
    [dispatch]
  )
  const stateValue =
    isFetchingMore === undefined ? fetchMoreLoading : isFetchingMore
  return [stateValue, setFetchMore]
}

const useFetchMoreOnStateChange = (fetchMore, isFetchingMore) => {
  const isFetchingRef = useRef(false)
  const isFetchingPrevious = isFetchingRef.current
  // Fire fetch more if user just pressed on button, save previous state on ref to not get lost
  if (isFetchingMore && !isFetchingPrevious) {
    fetchMore()
  }
  isFetchingRef.current = isFetchingMore
}

/**
 * Search Result Container Component.
 */
const SearchResultContainer = props => {
  const {
    maxItemsPerPage = 10,
    searchQuery: {
      fetchMore,
      data: {
        facets: {
          brands = [],
          specificationFilters = [],
          priceRanges = [],
          categoriesTrees,
        } = {},
        productSearch: { products = [], recordsFiltered, breadcrumb = [] } = {},
      } = {},
      loading,
      variables: { query },
    },
    pagination,
    children,
  } = props

  const [fetchMoreLoading, setFetchMoreLoading] = useFetchingMore()

  const fetchMoreLocked = useRef(false)

  const handleFetchMore = () => {
    if (fetchMoreLocked.current || products.length === 0) {
      return
    }

    fetchMoreLocked.current = true

    const to = min(maxItemsPerPage + products.length, recordsFiltered) - 1

    setFetchMoreLoading(true)

    fetchMore({
      variables: {
        from: products.length,
        to,
      },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        setFetchMoreLoading(false)
        fetchMoreLocked.current = false

        // backwards compatibility
        if (prevResult.search) {
          return {
            search: {
              ...prevResult.search,
              products: [
                ...prevResult.search.products,
                ...fetchMoreResult.search.products,
              ],
            },
          }
        }

        return {
          ...prevResult,
          productSearch: {
            ...prevResult.productSearch,
            products: [
              ...prevResult.productSearch.products,
              ...fetchMoreResult.productSearch.products,
            ],
          },
        }
      },
    })
  }

  useFetchMoreOnStateChange(handleFetchMore, fetchMoreLoading)

  const ResultComponent =
    pagination === PAGINATION_TYPES[0]
      ? ShowMoreLoaderResult
      : InfiniteScrollLoaderResult

  return (
    <Container className="pt3-m pt5-l">
      <PopupProvider>
        <div id="search-result-anchor" />
        <ResultComponent
          {...props}
          breadcrumbsProps={{ breadcrumb }}
          onFetchMore={handleFetchMore}
          fetchMoreLoading={fetchMoreLoading}
          query={query}
          loading={loading}
          recordsFiltered={recordsFiltered}
          products={products}
          brands={brands}
          specificationFilters={specificationFilters}
          priceRanges={priceRanges}
          tree={categoriesTrees}
        >
          {children}
        </ResultComponent>
      </PopupProvider>
    </Container>
  )
}

SearchResultContainer.propTypes = searchResultContainerPropTypes

export default SearchResultContainer
