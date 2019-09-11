import React, { useState, useRef, useCallback } from 'react'
import { min } from 'ramda'

import { Container } from 'vtex.store-components'

import { PopupProvider } from './Popup'
import InfiniteScrollLoaderResult from './loaders/InfiniteScrollLoaderResult'
import ShowMoreLoaderResult from './loaders/ShowMoreLoaderResult'
import { searchResultContainerPropTypes } from '../constants/propTypes'
import { useRuntime } from 'vtex.render-runtime'
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
    page,
    children,
  } = props

  const pageRef = useRef(page)

  const [fetchMoreLoading, setFetchMoreLoading] = useFetchingMore()

  const fetchMoreLocked = useRef(false)

  const { setQuery } = useRuntime()

  // ===============================================================
  const fromRef = useRef((page - 1) * maxItemsPerPage)
  const toRef = useRef(fromRef.current + maxItemsPerPage - 1)

  //const handleFetchMorePrevious = () => {}

  const handleFetchMore = (from, to, isForward) => {
    if (fetchMoreLocked.current || products.length === 0) {
      return
    }

    fetchMoreLocked.current = true

    setFetchMoreLoading(true)

    fetchMore({
      variables: {
        from: from,
        to: to,
      },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        setFetchMoreLoading(false)
        fetchMoreLocked.current = false

        // backwards compatibility
        if (prevResult.search) {
          return {
            search: {
              ...prevResult.search,
              products: isForward
                ? [
                    ...prevResult.search.products,
                    ...fetchMoreResult.search.products,
                  ]
                : [
                    ...fetchMoreResult.search.products,
                    ...prevResult.search.products,
                  ],
            },
          }
        }

        return {
          ...prevResult,
          productSearch: {
            ...prevResult.productSearch,
            products: isForward
              ? [
                  ...prevResult.productSearch.products,
                  ...fetchMoreResult.productSearch.products,
                ]
              : [
                  ...fetchMoreResult.productSearch.products,
                  ...prevResult.productSearch.products,
                ],
          },
        }
      },
    })
  }

  const handleFetchMoreLoading = () => {
    handleFetchMore(fromRef.current, toRef.current, true)
  }

  const handleFetchMoreNext = () => {
    const from = toRef.current + 1
    const to = min(recordsFiltered, from + maxItemsPerPage) - 1
    handleFetchMore(from, to, true)
    toRef.current = to
    pageRef.current += 1
    setQuery({ page: pageRef.current }, { replace: true })
  }
  // ===============================================================

  useFetchMoreOnStateChange(handleFetchMoreLoading, fetchMoreLoading)

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
          onFetchMore={handleFetchMoreNext}
          fetchMoreLoading={fetchMoreLoading}
          query={query}
          loading={loading}
          recordsFiltered={recordsFiltered}
          products={products}
          brands={brands}
          specificationFilters={specificationFilters}
          priceRanges={priceRanges}
          tree={categoriesTrees}
          to={toRef.current}
          from={fromRef.current}
        >
          {children}
        </ResultComponent>
      </PopupProvider>
    </Container>
  )
}

SearchResultContainer.propTypes = searchResultContainerPropTypes

export default SearchResultContainer
