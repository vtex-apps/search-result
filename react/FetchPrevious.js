import React, { useRef } from 'react'
import { path, max } from 'ramda'
import classNames from 'classnames'
import { useRuntime } from 'vtex.render-runtime'
import FetchPreviousButton from './components/loaders/FetchPreviousButton'

import {
  useSearchPageState,
  useSearchPage,
  useSearchPageStateDispatch,
} from 'vtex.search-page-context/SearchPageContext'

import styles from './searchResult.css'

const FetchPrevious = () => {
  const { searchQuery, maxItemsPerPage, page } = useSearchPage()
  const { isFetchingMore } = useSearchPageState()
  const dispatch = useSearchPageStateDispatch()
  const products = path(['data', 'productSearch', 'products'], searchQuery)
  const recordsFiltered = path(
    ['data', 'productSearch', 'recordsFiltered'],
    searchQuery
  )

  const fetchMore = path(['fetchMore'], searchQuery)
  const fetchMoreLocked = useRef(false)
  const { setQuery } = useRuntime()

  const pageRef = useRef(page)
  const fromRef = useRef((page - 1) * maxItemsPerPage)

  const setFetchMoreLoading = isLoading => {
    dispatch({ type: 'SET_FETCHING_MORE', args: { isFetchingMore: isLoading } })
  }

  const handleFetchMore = (from, to) => {
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
              products: [
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
            products: [
              ...fetchMoreResult.productSearch.products,
              ...prevResult.productSearch.products,
            ],
          },
        }
      },
    })
  }

  const handleFetchMorePrevious = () => {
    const to = fromRef.current - 1
    const from = max(0, to - maxItemsPerPage + 1)
    handleFetchMore(from, to, false)
    fromRef.current = from
    pageRef.current = pageRef.current == 2 ? undefined : pageRef.current - 1
    setQuery({ page: pageRef.current }, { replace: true })
  }

  if (isFetchingMore === undefined) {
    return null
  }

  return (
    <div
      className={classNames(
        styles['buttonShowMore--layout'],
        'w-100 flex justify-center'
      )}
    >
      <FetchPreviousButton
        products={products}
        from={fromRef.current}
        recordsFiltered={recordsFiltered}
        onFetchPrevious={handleFetchMorePrevious}
        fetchMoreLoading={isFetchingMore}
      />
    </div>
  )
}

export default FetchPrevious
