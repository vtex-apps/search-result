import React, { useRef } from 'react'
import { path, min } from 'ramda'
import classNames from 'classnames'
import { useRuntime } from 'vtex.render-runtime'
import FetchMoreButton from './components/loaders/FetchMoreButton'
import LoadingSpinner from './components/loaders/LoadingSpinner'
import { PAGINATION_TYPE } from './utils/paginationType'

import {
  useSearchPageState,
  useSearchPage,
  useSearchPageStateDispatch,
} from 'vtex.search-page-context/SearchPageContext'

import styles from './searchResult.css'

const FetchMore = () => {
  const { pagination, searchQuery, maxItemsPerPage, page } = useSearchPage()
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
  const toRef = useRef(page * maxItemsPerPage - 1)

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

  const handleFetchMoreNext = () => {
    const from = toRef.current + 1
    const to = min(recordsFiltered, from + maxItemsPerPage) - 1
    handleFetchMore(from, to)
    toRef.current = to
    pageRef.current++
    setQuery({ page: pageRef.current }, { replace: true })
  }

  const isShowMore = pagination === PAGINATION_TYPE.SHOW_MORE

  if (isFetchingMore === undefined) {
    return null
  }

  if (isShowMore) {
    return (
      <div
        className={classNames(
          styles['buttonShowMore--layout'],
          'w-100 flex justify-center'
        )}
      >
        <FetchMoreButton
          products={products}
          to={toRef.current}
          recordsFiltered={recordsFiltered}
          onFetchMore={handleFetchMoreNext}
          fetchMoreLoading={isFetchingMore}
          showProductsCount={false}
        />
      </div>
    )
  }

  return <LoadingSpinner fetchMoreLoading={isFetchingMore} />
}

export default FetchMore
