import { renderHook, act } from '@testing-library/react-hooks'

import useFacetNavigation, {
  buildNewQueryMap,
} from '../hooks/useFacetNavigation'
// eslint-disable-next-line jest/no-mocks-import
import { useRuntime } from '../__mocks__/vtex.render-runtime'
import { useFilterNavigator } from '../components/FilterNavigatorContext'

jest.mock('../components/QueryContext')
jest.mock('../components/FilterNavigatorContext')

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

test('navigating to another category facet', () => {
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

  const {
    mock: {
      calls: [[navigateCall]],
    },
  } = mockNavigate

  expect(navigateCall.to).toBe('/clothing/shorts')
})

test('joins categories', () => {
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

  const {
    mock: {
      calls: [[navigateCall]],
    },
  } = mockNavigate

  expect(navigateCall.to).toBe('/clothing/shorts/brand')
  expect(navigateCall.query).toBe('map=b')
})

test('pass array of facets as args work', () => {
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

  const {
    mock: {
      calls: [[navigateCall]],
    },
  } = mockNavigate

  expect(navigateCall.to).toBe('/clothing/shorts/brand/otherbrand/gender_Mens')
  expect(navigateCall.query).toBe('map=b%2Cb')
})

// We've removed the concept of preventRouteChange since the urls should be transformed to the new urls format.

describe('buildNewQueryMap - RadioGroup behavior', () => {
  const radioFacet = {
    key: 'shipping',
    name: 'Delivery',
    value: 'shipping',
    selected: false,
    quantity: 1,
    map: 'shipping',
  }

  const radioFacetSelected = { ...radioFacet, selected: true }
  const otherFacet = {
    key: 'color',
    name: 'Red',
    value: 'red',
    selected: true,
    quantity: 1,
    map: 'color',
  }

  it('removes radio facet from selectedFacets and calls onShouldIgnore(false) when not selected', () => {
    const onShouldIgnore = jest.fn()
    const facets = [radioFacet, otherFacet]
    const selectedFacets = [radioFacet, otherFacet]
    const result = buildNewQueryMap(
      {},
      facets,
      selectedFacets,
      false,
      onShouldIgnore
    )

    expect(result.query).toContain('shipping')
    expect(result.query).not.toContain('red')
    expect(onShouldIgnore).toHaveBeenCalledWith(false)
  })

  it('keeps radio facet and calls onShouldIgnore(true) when selected', () => {
    const onShouldIgnore = jest.fn()
    const facets = [radioFacetSelected, otherFacet]
    const selectedFacets = [radioFacetSelected, otherFacet]
    const result = buildNewQueryMap(
      {},
      facets,
      selectedFacets,
      false,
      onShouldIgnore
    )

    expect(result.query).toContain('ignore')
    expect(onShouldIgnore).toHaveBeenCalledWith(true)
  })

  it('adds ignore to query and radio key to map when shouldIgnore is true and radio selected', () => {
    const onShouldIgnore = jest.fn()
    const facets = [radioFacetSelected, otherFacet]
    const selectedFacets = [radioFacetSelected, otherFacet]
    const result = buildNewQueryMap(
      {},
      facets,
      selectedFacets,
      true,
      onShouldIgnore
    )

    expect(result.query).toContain('ignore')
    expect(result.map).toContain('shipping')
  })
})
