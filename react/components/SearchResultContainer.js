import React, { useState, useRef, useCallback } from 'react'
import { min, max } from 'ramda'
import InfiniteScroll from 'react-infinite-scroll-component'

import { PopupProvider } from './Popup'
import SearchResult from './SearchResult'
import { searchResultContainerPropTypes } from '../constants/propTypes'
import { PAGINATION_TYPE } from '../utils/paginationType'
import { useRuntime } from 'vtex.render-runtime'
import { Container } from 'vtex.store-components'
import {
  useSearchPageStateDispatch,
  useSearchPageState,
} from 'vtex.search-page-context/SearchPageContext'

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
  const nextPageRef = useRef(page + 1)
  const previousPageRef = useRef(page - 1)

  const [fetchMoreLoading, setFetchMoreLoading] = useFetchingMore()

  const fetchMoreLocked = useRef(false)

  const { setQuery } = useRuntime()

  const fromRef = useRef((page - 1) * maxItemsPerPage)
  const toRef = useRef(fromRef.current + maxItemsPerPage - 1)

  const handleFetchMore = (from, to, isForward) => {
    if (fetchMoreLocked.current || products.length === 0) {
      return
    }

    fetchMoreLocked.current = true

    setFetchMoreLoading(true)

    fetchMore({
      variables: {
        from,
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

  const handleFetchMoreNext = () => {
    const from = toRef.current + 1
    const to = min(recordsFiltered, from + maxItemsPerPage) - 1
    handleFetchMore(from, to, true)
    toRef.current = to
    pageRef.current = nextPageRef.current
    nextPageRef.current += 1
    setQuery({ page: pageRef.current }, { replace: true })
  }

  const handleFetchMorePrevious = () => {
    const to = fromRef.current - 1
    const from = max(0, to - maxItemsPerPage + 1)
    handleFetchMore(from, to, false)
    fromRef.current = from
    pageRef.current =
      previousPageRef.current == 1 ? undefined : previousPageRef.current
    previousPageRef.current -= 1
    setQuery({ page: pageRef.current }, { replace: true })
  }

  const resultComponent = children || (
    <SearchResult
      {...props}
      breadcrumbsProps={{ breadcrumb }}
      onFetchMore={handleFetchMoreNext}
      fetchMoreLoading={fetchMoreLoading}
      onFetchPrevious={handleFetchMorePrevious}
      pagination={pagination}
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
    />
  )

  const infiniteScrollComponent = (
    <InfiniteScroll
      style={{ overflow: 'none' }}
      dataLength={products.length}
      next={handleFetchMoreNext}
      hasMore={toRef.current + 1 < recordsFiltered}
      useWindow={false}
    >
      {resultComponent}
    </InfiniteScroll>
  )

  const isInfiniteScroll = pagination === PAGINATION_TYPE.INFINITE_SCROLL

  return (
    <Container className="pt3-m pt5-l">
      <PopupProvider>
        <div id="search-result-anchor" />
        {isInfiniteScroll ? infiniteScrollComponent : resultComponent}
      </PopupProvider>
    </Container>
  )
}

SearchResultContainer.propTypes = searchResultContainerPropTypes

export default SearchResultContainer
