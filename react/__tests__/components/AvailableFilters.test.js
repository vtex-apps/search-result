import React from 'react'
import { useRuntime } from 'vtex.render-runtime'
import { render } from '@vtex/test-tools/react'

import AvailableFilters from '../../components/AvailableFilters'

beforeEach(() => {
  jest.clearAllMocks()

  useRuntime.mockImplementation(() => ({
    getSettings: () => ({}),
    culture: { country: 'USA', currency: 'USD' },
  }))
})

const mockProps = {
  filters: [
    {
      type: 'PriceRanges',
      title: 'store/search.filter.title.price-ranges',
      facets: [
        {
          id: null,
          quantity: 1,
          name: '',
          key: 'price',
          selected: false,
          value: null,
          link: null,
          linkEncoded: null,
          href: null,
          range: {
            from: 1.11,
            to: 10,
            __typename: 'Range',
          },
          children: null,
          __typename: 'FacetValue',
          map: 'price',
          slug: 'de-1.11-a-10',
        },
      ],
    },
  ],
  preventRouteChange: false,
  initiallyCollapsed: false,
  navigateToFacet: () => {},
  truncatedFacetsFetched: false,
  setTruncatedFacetsFetched: () => {},
  closeOnOutsideClick: false,
  appliedFiltersOverview: 'hide',
  showClearByFilter: false,
}

describe('<AvailableFilters />', () => {
  const renderComponent = (customProps) => {
    const props = { ...mockProps, ...customProps }

    return render(<AvailableFilters {...props} />)
  }

  it('should render priceRange', () => {
    const { getByText } = renderComponent()

    expect(getByText('$1.00 $10.00')).toBeInTheDocument()
  })
})
