import React from 'react'
import { render } from '@vtex/test-tools/react'
import AccordionFilterContainer from '../components/AccordionFilterContainer'

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

  it('should match snapshot', () => {
    const { asFragment } = renderComponent()

    expect(asFragment()).toMatchSnapshot()
  })
})
