import { fireEvent, render } from '@vtex/test-tools/react'
import React from 'react'
import { useRuntime } from 'vtex.render-runtime'

import PriceRange from '../../components/PriceRange'

const mockUseRuntime = useRuntime
const mockSetQuery = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()

  mockUseRuntime.mockImplementation(() => ({
    setQuery: mockSetQuery,
    getSettings: () => ({}),
    culture: { country: 'USA', currency: 'USD' },
  }))
})

const mockProps = {
  title: 'Price Range',
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
        from: 2,
        to: 9,
        __typename: 'Range',
      },
      children: null,
      __typename: 'FacetValue',
      map: 'price',
      slug: 'de-2-a-9',
    },
  ],
  preventRouteChange: false,
}

describe('<PriceRange />', () => {
  const renderComponent = (customProps) => {
    const props = { ...mockProps, ...customProps }

    return render(<PriceRange {...props} />)
  }

  it('should call setQuery on Slider change', () => {
    jest.useFakeTimers()

    const { getByText } = renderComponent()

    fireEvent.click(getByText('$1.00 $10.00'))

    expect(mockSetQuery).not.toBeCalled()

    jest.runAllTimers()

    expect(mockSetQuery).toHaveBeenCalledTimes(1)
  })

  it('should call setQuery on Slider change only once after multiple interactions', () => {
    jest.useFakeTimers()

    const { getByText } = renderComponent()

    fireEvent.click(getByText('$1.00 $10.00'))
    fireEvent.click(getByText('$1.00 $10.00'))

    expect(mockSetQuery).not.toBeCalled()

    jest.runAllTimers()

    expect(mockSetQuery).toHaveBeenCalledTimes(1)
  })

  it('should render defaultValues', () => {
    const { getByText } = renderComponent({ priceRange: '2 TO 9' })

    expect(getByText('$2.00 $9.00')).toBeInTheDocument()
  })

  it('sould not render Slider if there are no options', () => {
    const { queryByText } = renderComponent({ facets: [] })

    expect(queryByText('Slider')).toBeNull()
  })
})
