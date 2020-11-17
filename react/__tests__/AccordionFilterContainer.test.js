import React from 'react'
import { render } from '@vtex/test-tools/react'
import AccordionFilterContainer from '../components/AccordionFilterContainer'
import { useRuntime } from '../__mocks__/vtex.render-runtime'

const mockUseRuntime = useRuntime

beforeEach(() => {
  jest.clearAllMocks()

  mockUseRuntime.mockImplementation(() => ({
    getSettings: () => ({}),
  }))
})

describe('<AccordionFilterContainer />', () => {
  const renderComponent = () => {
    const filters = [
      {
        title: 'price-range1',
        type: 'PriceRanges',
        facets: [
          {
            name: 'name2',
            quantity: 5,
          },
        ],
      },
    ]

    const priceRange = '1 TO 20000000'
    const tree = []

    return render(
      <AccordionFilterContainer
        filters={filters}
        tree={tree}
        priceRange={priceRange}
      />
    )
  }

  it('check if mobile price range exists', () => {
    const { getByText } = renderComponent()
    expect(getByText('price-range1')).toBeInTheDocument()
  })
})
