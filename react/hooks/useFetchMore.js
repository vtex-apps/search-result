import { useState, useRef, useCallback, useEffect, useReducer } from 'react'
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

function reducer(state, action) {
  const { maxItemsPerPage, to, from, rollbackState } = action.args
  switch (action.type) {
    case 'RESET':
      return {
        page: 1,
        nextPage: 2,
        previousPage: 0,
        from: 0,
        to: maxItemsPerPage - 1,
      }
    case 'NEXT_PAGE':
      return {
        ...state,
        page: state.nextPage,
        nextPage: state.nextPage + 1,
        to,
      }
    case 'PREVIOUS_PAGE':
      return {
        ...state,
        page: state.previousPage,
        previousPage: state.previousPage - 1,
        from,
      }

    case 'ROLLBACK':
      return rollbackState
  }
}

const handleFetchMore = async (
  from,
  to,
  direction,
  fetchMoreLocked,
  setLoading,
  fetchMore,
  products,
  updateQueryError
) => {
  if (fetchMoreLocked.current || products.length === 0) {
    return
  }

  const isForward = direction === FETCH_TYPE.NEXT

  fetchMoreLocked.current = true

  setLoading(true)

  return fetchMore({
    variables: {
      from,
      to,
    },
    updateQuery: (prevResult, { fetchMoreResult }) => {
      setLoading(false)
      fetchMoreLocked.current = false

      if (!prevResult || !fetchMoreResult) {
        updateQueryError.current = true
        return
      }

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
  }).catch(error => {
    setLoading(false)
    fetchMoreLocked.current = false
    updateQueryError.current = true
    return { error: error }
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

export const useFetchMore = props => {
  const {
    page,
    recordsFiltered,
    maxItemsPerPage,
    fetchMore,
    products,
    queryData: { query, map, orderBy, priceRange },
  } = props
  const { setQuery } = useRuntime()
  const initialState = {
    page,
    nextPage: page + 1,
    previousPage: page - 1,
    from: (page - 1) * maxItemsPerPage,
    to: page * maxItemsPerPage - 1,
  }
  const [pageState, pageDispatch] = useReducer(reducer, initialState)
  const [loading, setLoading] = useFetchingMore()
  const isFirstRender = useRef(true)
  const fetchMoreLocked = useRef(false) // prevents the user from sending two requests at once
  /* this is a temporary solution to deal with unexpected 
  errors when the search result uses infinite scroll. 
  This should be removed once infinite scrolling is removed */
  const [infiniteScrollError, setInfiniteScrollError] = useState(false)
  const updateQueryError = useRef(false) //TODO: refactor this ref

  useEffect(() => {
    if (!isFirstRender.current) {
      pageDispatch({ type: 'RESET', args: { maxItemsPerPage } })
    }
    isFirstRender.current = false
  }, [maxItemsPerPage, query, map, orderBy, priceRange])

  const handleFetchMoreNext = async () => {
    const rollbackState = pageState
    const from = pageState.to + 1
    const to = min(recordsFiltered, from + maxItemsPerPage) - 1
    setInfiniteScrollError(false)
    pageDispatch({ type: 'NEXT_PAGE', args: { to } })
    setQuery({ page: pageState.nextPage }, { replace: true })
    const promiseResult = await handleFetchMore(
      from,
      to,
      FETCH_TYPE.NEXT,
      fetchMoreLocked,
      setLoading,
      fetchMore,
      products,
      updateQueryError
    )
    //if error, rollback
    if (promiseResult && updateQueryError.current) {
      pageDispatch({ type: 'ROLLBACK', args: { rollbackState } })
      setQuery({ page: pageState.page }, { replace: true })
      setInfiniteScrollError(true)
      updateQueryError.current = false
    }
  }

  const handleFetchMorePrevious = async () => {
    const rollbackState = pageState
    const to = pageState.from - 1
    const from = max(0, to - maxItemsPerPage + 1)
    setInfiniteScrollError(false)
    pageDispatch({ type: 'PREVIOUS_PAGE', args: { from } })
    setQuery({ page: pageState.previousPage }, { replace: true, merge: true })
    const promiseResult = await handleFetchMore(
      from,
      to,
      FETCH_TYPE.PREVIOUS,
      fetchMoreLocked,
      setLoading,
      fetchMore,
      products,
      updateQueryError
    )
    //if error, rollback
    if (promiseResult && updateQueryError.current) {
      pageDispatch({ type: 'ROLLBACK', args: { rollbackState } })
      setQuery({ page: pageState.page }, { replace: true, merge: true })
      setInfiniteScrollError(true)
      updateQueryError.current = false
    }
  }

  return {
    handleFetchMoreNext,
    handleFetchMorePrevious,
    loading,
    from: pageState.from,
    to: pageState.to,
    infiniteScrollError,
  }
}
