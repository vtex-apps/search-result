import { useState, useRef, useCallback, useEffect, useReducer } from 'react'
// eslint-disable-next-line no-restricted-imports
import { max } from 'ramda'
import { useRuntime } from 'vtex.render-runtime'
import {
  useSearchPageStateDispatch,
  useSearchPageState,
} from 'vtex.search-page-context/SearchPageContext'

import useSearchState from './useSearchState'

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

    default:
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
  updateQueryError,
  fuzzy,
  operator,
  searchState
  // eslint-disable-next-line max-params
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
      fuzzy,
      operator,
      searchState,
    },
    updateQuery: (prevResult, { fetchMoreResult }) => {
      setLoading(false)
      fetchMoreLocked.current = false

      if (!products || !fetchMoreResult) {
        updateQueryError.current = true

        return
      }

      // backwards compatibility
      if (prevResult && prevResult.search) {
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
        ...fetchMoreResult,
        productSearch: {
          ...fetchMoreResult.productSearch,
          products: isForward
            ? [...products, ...fetchMoreResult.productSearch.products]
            : [...fetchMoreResult.productSearch.products, ...products],
        },
      }
    },
  }).catch((error) => {
    setLoading(false)
    fetchMoreLocked.current = false
    updateQueryError.current = true

    return { error }
  })
}

const useFetchingMore = () => {
  const [loading, localSetMore] = useState(false)
  const { isFetchingMore } = useSearchPageState()
  const dispatch = useSearchPageStateDispatch()
  const setFetchMore = useCallback(
    (value) => {
      dispatch({ type: 'SET_FETCHING_MORE', args: { isFetchingMore: value } })
      localSetMore(value)
    },
    [dispatch]
  )

  const stateValue = isFetchingMore == null ? loading : isFetchingMore

  return [stateValue, setFetchMore]
}

export const useFetchMore = (props) => {
  const {
    page,
    maxItemsPerPage,
    fetchMore,
    products,
    queryData: { query, map, orderBy, priceRange },
  } = props

  const { setQuery, query: runtimeQuery } = useRuntime()
  const { fuzzy, operator, searchState } = useSearchState()
  const currentPage = (runtimeQuery.page && Number(runtimeQuery.page)) || page

  const initialState = {
    page: currentPage,
    nextPage: currentPage + 1,
    previousPage: currentPage - 1,
    from: (page - 1) * maxItemsPerPage,
    to: currentPage * maxItemsPerPage - 1,
  }

  const [pageState, pageDispatch] = useReducer(reducer, initialState)
  const [loading, setLoading] = useFetchingMore()
  const isFirstRender = useRef(true)
  const fetchMoreLocked = useRef(false) // prevents the user from sending two requests at once
  /* this is a temporary solution to deal with unexpected 
  errors when the search result uses infinite scroll. 
  This should be removed once infinite scrolling is removed */
  const [infiniteScrollError, setInfiniteScrollError] = useState(false)
  const updateQueryError = useRef(false) // TODO: refactor this ref

  useEffect(() => {
    if (!isFirstRender.current) {
      pageDispatch({ type: 'RESET', args: { maxItemsPerPage } })
    }

    isFirstRender.current = false
  }, [maxItemsPerPage, query, map, orderBy, priceRange])

  const handleFetchMoreNext = async () => {
    const rollbackState = pageState
    const from = pageState.to + 1
    const to = from + maxItemsPerPage - 1

    setInfiniteScrollError(false)
    pageDispatch({ type: 'NEXT_PAGE', args: { to } })

    setQuery(
      {
        page: pageState.nextPage,
      },
      { replace: true }
    )

    const promiseResult = await handleFetchMore(
      from,
      to,
      FETCH_TYPE.NEXT,
      fetchMoreLocked,
      setLoading,
      fetchMore,
      products,
      updateQueryError,
      fuzzy,
      operator,
      sessionStorage.getItem('searchState') ?? searchState
    )

    // success
    if (!promiseResult || !updateQueryError.current) {
      return
    }

    // if error, rollback
    pageDispatch({ type: 'ROLLBACK', args: { rollbackState } })
    setQuery({ page: pageState.page }, { replace: true })
    setInfiniteScrollError(true)
    updateQueryError.current = false
  }

  const handleFetchMorePrevious = async () => {
    const rollbackState = pageState
    const to = pageState.from - 1
    const from = max(0, to - maxItemsPerPage + 1)

    setInfiniteScrollError(false)
    pageDispatch({ type: 'PREVIOUS_PAGE', args: { from } })

    setQuery(
      {
        page: pageState.previousPage,
      },
      { replace: true, merge: true }
    )

    const promiseResult = await handleFetchMore(
      from,
      to,
      FETCH_TYPE.PREVIOUS,
      fetchMoreLocked,
      setLoading,
      fetchMore,
      products,
      updateQueryError,
      fuzzy,
      operator,
      sessionStorage.getItem('searchState') ?? searchState
    )

    // success
    if (!promiseResult || !updateQueryError.current) {
      return
    }

    // if error, rollback
    pageDispatch({ type: 'ROLLBACK', args: { rollbackState } })
    setQuery({ page: pageState.page }, { replace: true, merge: true })
    setInfiniteScrollError(true)
    updateQueryError.current = false
  }

  return {
    handleFetchMoreNext,
    handleFetchMorePrevious,
    loading,
    from: pageState.from,
    to: pageState.to,
    nextPage: pageState.nextPage,
    previousPage: pageState.previousPage,
    infiniteScrollError,
  }
}
