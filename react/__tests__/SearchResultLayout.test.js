/* eslint-env jest */
import React from 'react'
import { render } from '@vtex/test-tools/react'
import { useDevice } from 'vtex.device-detector'
import { useRuntime } from 'vtex.render-runtime'

jest.mock('../index', () => ({
  default: {
    getSchema: () => ({ properties: {} }),
  },
}))

import SearchResultLayout from '../SearchResultLayout'

const mockUseAds = jest.fn(() => ({
  ads: [],
  failed: [],
  isLoading: false,
  error: undefined,
  refresh: jest.fn(),
}))

jest.mock('@vtex/ads-react', () => ({
  useAds: (...args) => mockUseAds(...args),
}))

const mockUseRuntime = useRuntime

const baseSearchQuery = {
  variables: {
    selectedFacets: [],
  },
  data: {
    productSearch: {
      products: [{ id: '1' }],
    },
  },
  loading: false,
}

beforeEach(() => {
  jest.clearAllMocks()

  mockUseRuntime.mockImplementation(() => ({
    route: { params: {}, pageContext: {} },
    getSettings: () => ({}),
  }))

  useDevice.mockImplementation(() => ({ isMobile: false }))
})

describe('SearchResultLayout — sponsored products term', () => {
  test.each([
    ['sellerName', 'ofertec'],
    ['seller', 'shpseller382'],
  ])(
    'uses route.params.term when fullText is undefined (map=%s)',
    (mapValue, term) => {
      mockUseRuntime.mockImplementation(() => ({
        route: { params: { term }, pageContext: { type: 'search' } },
        getSettings: () => ({}),
      }))

      render(
        <SearchResultLayout
          searchQuery={{
            ...baseSearchQuery,
            variables: {
              fullText: undefined,
              map: mapValue,
              selectedFacets: [{ key: mapValue, value: term }],
            },
          }}
        />
      )

      expect(mockUseAds).toHaveBeenCalledWith(
        expect.objectContaining({ term })
      )
    }
  )

  it('uses fullText over route.params.term on regular search', () => {
    mockUseRuntime.mockImplementation(() => ({
      route: { params: { term: 'different-term' }, pageContext: { type: 'search' } },
      getSettings: () => ({}),
    }))

    render(
      <SearchResultLayout
        searchQuery={{
          ...baseSearchQuery,
          variables: {
            fullText: 'laptop',
            map: 'ft',
            selectedFacets: [],
          },
        }}
      />
    )

    expect(mockUseAds).toHaveBeenCalledWith(
      expect.objectContaining({ term: 'laptop' })
    )
  })

  it('passes undefined term when neither fullText nor route.params.term is available', () => {
    mockUseRuntime.mockImplementation(() => ({
      route: { params: {}, pageContext: { type: 'category' } },
      getSettings: () => ({}),
    }))

    render(
      <SearchResultLayout
        searchQuery={{
          ...baseSearchQuery,
          variables: {
            fullText: undefined,
            map: 'c',
            selectedFacets: [{ key: 'c', value: 'eletronicos' }],
          },
        }}
      />
    )

    expect(mockUseAds).toHaveBeenCalledWith(
      expect.objectContaining({ term: undefined })
    )
  })
})
