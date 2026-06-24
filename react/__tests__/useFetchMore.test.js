import { renderHook, act } from '@testing-library/react-hooks'

// eslint-disable-next-line jest/no-mocks-import
import { useRuntime } from '../__mocks__/vtex.render-runtime'
import { useFetchMore } from '../hooks/useFetchMore'

jest.mock('vtex.search-page-context/SearchPageContext', () => ({
  useSearchPageState: () => ({ isFetchingMore: false }),
  useSearchPageStateDispatch: () => jest.fn(),
}))

jest.mock('../hooks/useSearchState', () => ({
  __esModule: true,
  default: () => ({
    fuzzy: undefined,
    operator: undefined,
    searchState: undefined,
  }),
}))

const mockUseRuntime = useRuntime
const mockSetQuery = jest.fn()

const setRuntimePage = page => {
  mockUseRuntime.mockImplementation(() => ({
    setQuery: mockSetQuery,
    query: page === undefined ? {} : { page: String(page) },
  }))
}

const baseProps = {
  maxItemsPerPage: 24,
  fetchMore: jest.fn(),
  products: [{ id: 1 }],
  queryData: { query: 'q', map: 'm', orderBy: 'o', priceRange: undefined },
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('resets pagination to page 1 when the runtime page is externally cleared', () => {
  setRuntimePage(5)

  const { result, rerender } = renderHook(props => useFetchMore(props), {
    initialProps: { ...baseProps, page: 5 },
  })

  // Seeded from the URL: shopper is on page 5, so "load more" would go to page 6.
  expect(result.current.nextPage).toBe(6)

  // A location change clears the `page` query param through render-runtime.
  setRuntimePage(undefined)
  act(() => {
    rerender({ ...baseProps, page: 5 })
  })

  // The reducer must snap back to the first page.
  expect(result.current.nextPage).toBe(2)
  expect(result.current.from).toBe(0)
  expect(result.current.to).toBe(23)
})

test('does not reset when the shopper advances the page (load more)', () => {
  setRuntimePage(5)

  const { result, rerender } = renderHook(props => useFetchMore(props), {
    initialProps: { ...baseProps, page: 5 },
  })

  expect(result.current.nextPage).toBe(6)

  // The shopper clicks "load more": the URL page advances in lockstep — no reset.
  setRuntimePage(6)
  act(() => {
    rerender({ ...baseProps, page: 5 })
  })

  expect(result.current.nextPage).toBe(6)
})

test('does not reset on initial mount on the first page', () => {
  setRuntimePage(1)

  const { result } = renderHook(props => useFetchMore(props), {
    initialProps: { ...baseProps, page: 1 },
  })

  expect(result.current.nextPage).toBe(2)
  expect(result.current.from).toBe(0)
})
