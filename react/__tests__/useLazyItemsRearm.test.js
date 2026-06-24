import { renderHook } from '@testing-library/react-hooks'

import { useLazyItemsRearm } from '../hooks/useLazyItemsRearm'

const baseProps = {
  itemsLimit: 18,
  maxItemsPerPage: 24,
  from: 0,
  shouldLimitItems: true,
}

test('re-arms the lazy refill when the list shrinks back to the first window', () => {
  const setLazyItemsRemaining = jest.fn()
  const { rerender } = renderHook(props => useLazyItemsRearm(props), {
    initialProps: { ...baseProps, productsCount: 24, setLazyItemsRemaining },
  })

  expect(setLazyItemsRemaining).not.toHaveBeenCalled()

  // An external refetch (zipcode change) replaced the cached list with only
  // the initial lazy window — items 18..23 must be fetched again.
  rerender({ ...baseProps, productsCount: 18, setLazyItemsRemaining })

  expect(setLazyItemsRemaining).toHaveBeenCalledWith(6)
})

test('does not re-arm on initial mount', () => {
  const setLazyItemsRemaining = jest.fn()

  renderHook(props => useLazyItemsRearm(props), {
    initialProps: { ...baseProps, productsCount: 18, setLazyItemsRemaining },
  })

  expect(setLazyItemsRemaining).not.toHaveBeenCalled()
})

test('does not re-arm when the list grows (lazy refill or load more)', () => {
  const setLazyItemsRemaining = jest.fn()
  const { rerender } = renderHook(props => useLazyItemsRearm(props), {
    initialProps: { ...baseProps, productsCount: 18, setLazyItemsRemaining },
  })

  rerender({ ...baseProps, productsCount: 24, setLazyItemsRemaining })
  rerender({ ...baseProps, productsCount: 48, setLazyItemsRemaining })

  expect(setLazyItemsRemaining).not.toHaveBeenCalled()
})

test('does not re-arm when the list empties', () => {
  const setLazyItemsRemaining = jest.fn()
  const { rerender } = renderHook(props => useLazyItemsRearm(props), {
    initialProps: { ...baseProps, productsCount: 24, setLazyItemsRemaining },
  })

  rerender({ ...baseProps, productsCount: 0, setLazyItemsRemaining })

  expect(setLazyItemsRemaining).not.toHaveBeenCalled()
})

test('does not re-arm off the first page window (from > 0)', () => {
  const setLazyItemsRemaining = jest.fn()
  const { rerender } = renderHook(props => useLazyItemsRearm(props), {
    initialProps: {
      ...baseProps,
      from: 96,
      productsCount: 24,
      setLazyItemsRemaining,
    },
  })

  rerender({
    ...baseProps,
    from: 96,
    productsCount: 18,
    setLazyItemsRemaining,
  })

  expect(setLazyItemsRemaining).not.toHaveBeenCalled()
})

test('does not re-arm when lazy loading is disabled', () => {
  const setLazyItemsRemaining = jest.fn()
  const { rerender } = renderHook(props => useLazyItemsRearm(props), {
    initialProps: {
      ...baseProps,
      shouldLimitItems: false,
      productsCount: 24,
      setLazyItemsRemaining,
    },
  })

  rerender({
    ...baseProps,
    shouldLimitItems: false,
    productsCount: 18,
    setLazyItemsRemaining,
  })

  expect(setLazyItemsRemaining).not.toHaveBeenCalled()
})
