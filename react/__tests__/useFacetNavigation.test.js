import useFacetNavigation from '../hooks/useFacetNavigation'
import { renderHook, act } from '@testing-library/react-hooks'

jest.mock('../components/QueryContext')
jest.mock('../components/FilterNavigatorContext')

import { useRuntime } from '../__mocks__/vtex.render-runtime'
import { useFilterNavigator } from '../components/FilterNavigatorContext'

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
  useFilterNavigator.mockImplementation(() => ({
    map,
    query: 'clothing',
  }))

  const { result } = renderHook(() =>
    useFacetNavigation([
      {
        map,
        value: 'clothing',
      },
    ])
  )
  act(() => {
    result.current({ map: 'c', value: 'shorts' })
  })

  const navigateCall = mockNavigate.mock.calls[0][0]
  expect(navigateCall.to).toBe('/clothing/shorts')
})

it('joins categories', () => {
  const map = 'c,b'
  useFilterNavigator.mockImplementation(() => ({
    map,
    query: 'clothing/Brand',
  }))

  const selectedFacets = [
    { map: 'c', value: 'clothing' },
    { map: 'b', value: 'Brand' },
  ]

  const { result } = renderHook(() => useFacetNavigation(selectedFacets))
  act(() => {
    result.current({ map: 'c', value: 'shorts' })
  })

  const navigateCall = mockNavigate.mock.calls[0][0]
  expect(navigateCall.to).toBe('/clothing/shorts/brand')
  expect(navigateCall.query).toBe('map=b')
})

it('pass array of facets as args work', () => {
  const map = 'c,b'
  useFilterNavigator.mockImplementation(() => ({
    map,
    query: 'clothing/Brand',
  }))

  const selectedFacets = [
    { map: 'c', value: 'clothing' },
    { map: 'b', value: 'Brand' },
  ]

  const facets = [
    {
      map: 'b',
      value: 'OtherBrand',
      title: '',
    },
    {
      map: 'specificationFilter_100',
      value: 'Mens',
      title: 'gender',
    },
    { map: 'c', value: 'shorts', title: '', newQuerySegment: 'shorts' },
  ]
  const { result } = renderHook(() => useFacetNavigation(selectedFacets))
  act(() => {
    result.current(facets)
  })

  const navigateCall = mockNavigate.mock.calls[0][0]
  expect(navigateCall.to).toBe('/clothing/shorts/brand/otherbrand/gender_Mens')
  expect(navigateCall.query).toBe('map=b%2Cb')
})

// We've removed the concept of preventRouteChange since the urls should be transformed to the new urls format.
