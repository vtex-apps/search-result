import { useState, useRef, useCallback } from 'react'
import { min, max } from 'ramda'
import { useRuntime } from 'vtex.render-runtime'
import {
  useSearchPageStateDispatch,
  useSearchPageState,
} from 'vtex.search-page-context/SearchPageContext'

export const FETCH_TYPE = {
  NEXT: 'next',
  PREVIOUS: 'previous',
}

const handleFetchMore = (
  from,
  to,
  direction,
  fetchMoreLocked,
  setLoading,
  fetchMore,
  products
) => {
  if (fetchMoreLocked.current || products.length === 0) {
    return
  }

  const isForward = direction === FETCH_TYPE.NEXT

  fetchMoreLocked.current = true

  setLoading(true)

  fetchMore({
    variables: {
      from,
      to,
    },
    updateQuery: (prevResult, { fetchMoreResult }) => {
      setLoading(false)
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

const useFetchingMore = () => {
  const [loading, localSetMore] = useState(false)
  const { isFetchingMore } = useSearchPageState()
  const dispatch = useSearchPageStateDispatch()
  const setFetchMore = useCallback(
    value => {
      dispatch({ type: 'SET_FETCHING_MORE', args: { isFetchingMore: value } })
      localSetMore(value)
    },
    [dispatch]
  )
  const stateValue = isFetchingMore == null ? loading : isFetchingMore
  return [stateValue, setFetchMore]
}

export const useFetchMore = (
  page,
  recordsFiltered,
  maxItemsPerPage,
  fetchMore,
  products
) => {
  console.log('page', page)
  const { setQuery } = useRuntime()
  const currentPage = useRef(page)
  const nextPage = useRef(page + 1)
  const previousPage = useRef(page - 1)
  const currentFrom = useRef((page - 1) * maxItemsPerPage)
  const currentTo = useRef(currentFrom.current + maxItemsPerPage - 1)
  const [loading, setLoading] = useFetchingMore()
  const fetchMoreLocked = useRef(false) // prevents the user from sending two requests at once

  const handleFetchMoreNext = () => {
    const from = currentTo.current + 1
    const to = min(recordsFiltered, from + maxItemsPerPage) - 1
    handleFetchMore(
      from,
      to,
      FETCH_TYPE.NEXT,
      fetchMoreLocked,
      setLoading,
      fetchMore,
      products
    )
    currentTo.current = to
    currentPage.current = nextPage.current
    nextPage.current += 1
    setQuery({ page: currentPage.current }, { replace: true })
  }

  const handleFetchMorePrevious = () => {
    const to = currentFrom.current - 1
    const from = max(0, to - maxItemsPerPage + 1)
    handleFetchMore(
      from,
      to,
      FETCH_TYPE.PREVIOUS,
      fetchMoreLocked,
      setLoading,
      fetchMore,
      products
    )
    currentFrom.current = from
    currentPage.current =
      previousPage.current === 1 ? undefined : previousPage.current // if page === 1 we dont show it on url
    previousPage.current -= 1
    setQuery({ page: currentPage.current }, { replace: true, merge: true })
  }

  const resetPage = () => {
    currentPage.current = page
    nextPage.current = page + 1
    previousPage.current = page - 1
    currentFrom.current = (page - 1) * maxItemsPerPage
    currentTo.current = currentFrom.current + maxItemsPerPage - 1
  }

  return {
    resetPage,
    handleFetchMoreNext,
    handleFetchMorePrevious,
    loading,
    from: currentFrom.current,
    to: currentTo.current,
  }
}
