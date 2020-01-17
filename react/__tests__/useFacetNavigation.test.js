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
  // The new idea here is that we event though we pass the map=c,c,c to navigate we dont have it in our response anymore.
  // This state is recordered and sent by search-graphql so we can know where we are in catalog search
  const map = 'c'
  useQuery.mockImplementation(() => ({
    query: 'clothing',
    map,
  }))

  const { result } = renderHook(() => useFacetNavigation(map))
  act(() => {
    result.current({ map: 'c', value: 'shorts' })
  })

  const navigateCall = mockNavigate.mock.calls[0][0]
  expect(navigateCall.to).toBe('/clothing/shorts')
})

it('joins categories', () => {
  const map = 'c,b'
  useQuery.mockImplementation(() => ({
    query: 'clothing/Brand',
    map,
  }))

  const { result } = renderHook(() => useFacetNavigation(map))
  act(() => {
    result.current({ map: 'c', value: 'shorts' })
  })

  const navigateCall = mockNavigate.mock.calls[0][0]
  expect(navigateCall.to).toBe('/clothing/shorts/Brand')
  expect(navigateCall.query).toBe('map=b')
})

it('pass array of facets as args work', () => {
  const map = 'c,b'
  useQuery.mockImplementation(() => ({
    query: 'clothing/Brand',
    map,
  }))

  const { result } = renderHook(() => useFacetNavigation(map))
  act(() => {
    result.current([
      { map: 'b', value: 'OtherBrand', title: '' },
      { map: 'specificationFilter_100', value: 'Mens', title: 'gender' },
      { map: 'c', value: 'shorts', title: '' },
    ])
  })

  const navigateCall = mockNavigate.mock.calls[0][0]
  expect(navigateCall.to).toBe('/clothing/shorts/Brand/OtherBrand/gender_Mens')
  expect(navigateCall.query).toBe('map=b%2Cb')
})

// We've removed the concept of preventRouteChange since the urls should be transformed to the new urls format.