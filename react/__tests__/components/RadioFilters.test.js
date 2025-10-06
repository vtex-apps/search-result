import React from 'react'
import { render, fireEvent } from '@vtex/test-tools/react'

import RadioFilters from '../../components/RadioFilters'

const radioFacetsMock = [
  {
    key: 'shipping',
    name: 'Delivery',
    value: 'shipping',
    selected: false,
    quantity: 1,
    map: 'shipping',
  },
  {
    key: 'shipping',
    name: 'Pickup',
    value: 'pickup',
    selected: false,
    quantity: 1,
    map: 'shipping',
  },
]

describe('<RadioFilters />', () => {
  it('should render radio options', () => {
    const { getByLabelText } = render(
      <RadioFilters facets={radioFacetsMock} onChange={() => {}} />
    )

    expect(getByLabelText('Delivery')).toBeInTheDocument()
    expect(getByLabelText('Pickup')).toBeInTheDocument()
  })

  it('should call onChange when selecting an option', () => {
    const onChangeMock = jest.fn()
    const { getByLabelText } = render(
      <RadioFilters facets={radioFacetsMock} onChange={onChangeMock} />
    )

    fireEvent.click(getByLabelText('Pickup'))
    expect(onChangeMock).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'pickup' })
    )
  })

  it('should set selected radio', () => {
    const selectedFacets = [
      { ...radioFacetsMock[0], selected: true },
      radioFacetsMock[1],
    ]

    const { getByLabelText } = render(
      <RadioFilters facets={selectedFacets} onChange={() => {}} />
    )

    expect(getByLabelText('Delivery')).toBeChecked()
    expect(getByLabelText('Pickup')).not.toBeChecked()
  })

  it('should disable radio when quantity is 0', () => {
    const disabledFacets = [
      { ...radioFacetsMock[0], quantity: 0 },
      radioFacetsMock[1],
    ]

    const { getByLabelText } = render(
      <RadioFilters facets={disabledFacets} onChange={() => {}} />
    )

    expect(getByLabelText('Delivery')).toBeDisabled()
    expect(getByLabelText('Pickup')).not.toBeDisabled()
  })
})
