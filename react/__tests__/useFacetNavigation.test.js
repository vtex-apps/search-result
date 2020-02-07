import useFacetNavigation from '../hooks/useFacetNavigation'
import { renderHook, act } from '@testing-library/react-hooks'

jest.mock('../components/QueryContext')
const { useQuery } = require('../components/QueryContext')

import { useRuntime } from '../__mocks__/vtex.render-runtime'
const mockUseRuntime = useRuntime

const mockNavigate = jest.fn()
const mockSetQuery = jest.fn()
beforeEach(() => {
  jest.clearAllMocks()
  
  mockUseRuntime.mockImplementation(() => ({
    navigate: mockNavigate,
    setQuery: mockSetQuery,
  }))
})

it('navigating to another category facet', () => {
  useQuery.mockImplementation(() => ({
    query: 'clothing',
    map: 'c'
  }))
  
  const { result } = renderHook(() => useFacetNavigation())
  act(() => {
    result.current({ map: 'c', value: 'shorts' })
  })

  const navigateCall = mockNavigate.mock.calls[0][0]
  expect(navigateCall.to).toBe('/clothing/shorts')
  expect(navigateCall.query).toBe('map=c%2Cc')
})

it('joins categories', () => {
  useQuery.mockImplementation(() => ({
    query: 'clothing/Brand',
    map: 'c,b'
  }))
  
  const { result } = renderHook(() => useFacetNavigation())
  act(() => {
    result.current({ map: 'c', value: 'shorts' })
  })

  const navigateCall = mockNavigate.mock.calls[0][0]
  expect(navigateCall.to).toBe('/clothing/shorts/Brand')
  expect(navigateCall.query).toBe('map=c%2Cc%2Cb')
})

it('pass array of facets as args work', () => {
  useQuery.mockImplementation(() => ({
    query: 'clothing/Brand',
    map: 'c,b'
  }))
  
  const { result } = renderHook(() => useFacetNavigation())
  act(() => {
    result.current([{ map: 'b', value: 'OtherBrand' }, { map: 'specificationFilter_100', value: 'Mens' }, {map: 'c', value: 'shorts'}])
  })

  const navigateCall = mockNavigate.mock.calls[0][0]
  expect(navigateCall.to).toBe('/clothing/shorts/Brand/OtherBrand/Mens')
  expect(navigateCall.query).toBe('map=c%2Cc%2Cb%2Cb%2CspecificationFilter_100')
})


it('if preventRouteChange call setQuery and not navigate', () => {
  useQuery.mockImplementation(() => ({
    query: 'clothing/Brand',
    map: 'c,b'
  }))
  
  const { result } = renderHook(() => useFacetNavigation())
  act(() => {
    result.current({ map: 'c', value: 'shorts' }, true)
  })

  const setQueryCall = mockSetQuery.mock.calls[0][0]
  expect(setQueryCall.query).toBe('/clothing/shorts/Brand')
  expect(setQueryCall.map).toBe('c,c,b')
  expect(setQueryCall.page).toBe(undefined)
  expect(mockNavigate.mock.calls.length).toBe(0)

})