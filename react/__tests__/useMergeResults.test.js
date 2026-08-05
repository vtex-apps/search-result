import { renderHook, act } from '@testing-library/react-hooks'

import useMergeResults from '../hooks/useMergeResults'

const ORGANIC = [{ id: 'organic-1', cacheId: 'organic-1' }]

const SPONSORED = {
  advertisement: { placement: 'top_search' },
  product: { id: 'ad-1', cacheId: 'ad-1' },
}

const buildSearchQuery = ({
  loading = false,
  products = [],
  query = 'coral',
} = {}) => ({
  loading,
  variables: { query, fullText: query },
  data: {
    products,
    productSearch: { products },
  },
  products,
})

const buildProps = (searchQueryArgs, pageArgs = { from: 0, page: 1 }) => ({
  ...pageArgs,
  searchQuery: buildSearchQuery(searchQueryArgs),
})

const searching = pageArgs => buildProps({ loading: true }, pageArgs)
const searched = pageArgs => buildProps({ products: ORGANIC }, pageArgs)

const adsLoading = { isLoading: true, ads: [] }
const adsEmpty = { isLoading: false, ads: [] }
const adsLoaded = { isLoading: false, ads: [SPONSORED] }

const renderMergeResults = initialProps =>
  renderHook(
    ({ props, sponsoredSearchResult }) =>
      useMergeResults({ props, sponsoredSearchResult }),
    { initialProps }
  )

describe('useMergeResults', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('keeps the loader while both search and ads are loading', () => {
    const { result } = renderMergeResults({
      props: searching(),
      sponsoredSearchResult: adsLoading,
    })

    expect(result.current.searchQuery.loading).toBe(true)
    expect(result.current.searchQuery.products).toEqual([])
  })

  it('holds the organic result while ads are still loading', () => {
    const { result, rerender } = renderMergeResults({
      props: searching(),
      sponsoredSearchResult: adsLoading,
    })

    rerender({ props: searched(), sponsoredSearchResult: adsLoading })

    expect(result.current.searchQuery.loading).toBe(true)
    expect(result.current.searchQuery.products).toEqual([])
    expect(result.current.searchQuery.data.productSearch.products).toEqual([])
  })

  it('renders sponsored and organic together when ads arrive in time', () => {
    const { result, rerender } = renderMergeResults({
      props: searching(),
      sponsoredSearchResult: adsLoading,
    })

    rerender({ props: searched(), sponsoredSearchResult: adsLoaded })

    expect(result.current.searchQuery.loading).toBe(false)
    expect(result.current.searchQuery.products).toEqual([
      {
        id: 'ad-1',
        cacheId: 'ad-ad-1',
        advertisement: { placement: 'top_search' },
      },
      ...ORGANIC,
    ])
  })

  it('releases the organic result when ads settle without ads', () => {
    const { result, rerender } = renderMergeResults({
      props: searching(),
      sponsoredSearchResult: adsLoading,
    })

    rerender({ props: searched(), sponsoredSearchResult: adsEmpty })

    expect(result.current.searchQuery.loading).toBe(false)
    expect(result.current.searchQuery.products).toEqual(ORGANIC)
  })

  it('releases the organic result when ads exceed the wait limit', () => {
    const { result, rerender } = renderMergeResults({
      props: searching(),
      sponsoredSearchResult: adsLoading,
    })

    rerender({ props: searched(), sponsoredSearchResult: adsLoading })

    expect(result.current.searchQuery.loading).toBe(true)

    act(() => {
      jest.advanceTimersByTime(2000)
    })

    expect(result.current.searchQuery.loading).toBe(false)
    expect(result.current.searchQuery.products).toEqual(ORGANIC)
  })

  it('never sends a rendered result back to the loader', () => {
    const props = searched()

    const { result, rerender } = renderMergeResults({
      props: searching(),
      sponsoredSearchResult: adsLoading,
    })

    rerender({ props, sponsoredSearchResult: adsEmpty })

    expect(result.current.searchQuery.loading).toBe(false)

    // The ads hook refires on term/facets/identity changes.
    rerender({ props, sponsoredSearchResult: adsLoading })

    expect(result.current.searchQuery.loading).toBe(false)
    expect(result.current.searchQuery.products).toEqual(ORGANIC)

    rerender({ props, sponsoredSearchResult: adsEmpty })

    expect(result.current.searchQuery.loading).toBe(false)
    expect(result.current.searchQuery.products).toEqual(ORGANIC)
  })

  it('does not hold a search that already has results on first render', () => {
    const { result } = renderMergeResults({
      props: searched(),
      sponsoredSearchResult: adsLoading,
    })

    expect(result.current.searchQuery.loading).toBe(false)
    expect(result.current.searchQuery.products).toEqual(ORGANIC)
  })

  it('does not hold or merge ads outside the first page', () => {
    const secondPage = { from: 24, page: 2 }

    const { result } = renderMergeResults({
      props: searching(secondPage),
      sponsoredSearchResult: { isLoading: true, ads: [SPONSORED] },
    })

    expect(result.current.searchQuery.loading).toBe(true)
    expect(result.current.searchQuery.products).toEqual([])

    const { result: loaded } = renderMergeResults({
      props: searched(secondPage),
      sponsoredSearchResult: adsLoaded,
    })

    expect(loaded.current.searchQuery.products).toEqual(ORGANIC)
  })

  it('waits for ads again when a new search starts', () => {
    const { result, rerender } = renderMergeResults({
      props: searched(),
      sponsoredSearchResult: adsEmpty,
    })

    expect(result.current.searchQuery.loading).toBe(false)

    rerender({
      props: buildProps({ loading: true, query: 'tinta' }),
      sponsoredSearchResult: adsLoading,
    })

    expect(result.current.searchQuery.loading).toBe(true)
  })
})
