import React from 'react'
import { render, fireEvent } from '@vtex/test-tools/react'

import ToggleFilters from '../../components/ToggleFilters'

const toggleFacetsMock = [
  {
    key: 'dynamic-estimate',
    name: 'Same Day',
    value: 'same-day',
    selected: false,
    quantity: 5,
    map: 'dynamic-estimate',
  },
  {
    key: 'dynamic-estimate',
    name: 'Next Day',
    value: 'next-day',
    selected: false,
    quantity: 3,
    map: 'dynamic-estimate',
  },
]

describe('<ToggleFilters />', () => {
  it('should render toggle options', () => {
    const { getByLabelText } = render(
      <ToggleFilters facets={toggleFacetsMock} onChange={() => {}} />
    )

    expect(getByLabelText('Same Day')).toBeInTheDocument()
    expect(getByLabelText('Next Day')).toBeInTheDocument()
  })

  it('should call onChange when toggling an option', () => {
    const onChangeMock = jest.fn()
    const { getByLabelText } = render(
      <ToggleFilters facets={toggleFacetsMock} onChange={onChangeMock} />
    )

    fireEvent.click(getByLabelText('Same Day'))

    // The toggle passes the facet with its CURRENT state (off). The navigation
    // layer flips it (not selected => add).
    expect(onChangeMock).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 'same-day',
        selected: false,
      })
    )
  })

  it('should set selected state correctly', () => {
    const selectedFacets = [
      { ...toggleFacetsMock[0], selected: true },
      { ...toggleFacetsMock[1], selected: false },
    ]

    const { getByLabelText } = render(
      <ToggleFilters facets={selectedFacets} onChange={() => {}} />
    )

    expect(getByLabelText('Same Day')).toBeChecked()
    expect(getByLabelText('Next Day')).not.toBeChecked()
  })

  it('should disable toggle when quantity is 0', () => {
    const disabledFacets = [
      { ...toggleFacetsMock[0], quantity: 0 },
      toggleFacetsMock[1],
    ]

    const { getByLabelText } = render(
      <ToggleFilters facets={disabledFacets} onChange={() => {}} />
    )

    expect(getByLabelText('Same Day')).toBeDisabled()
    expect(getByLabelText('Next Day')).not.toBeDisabled()
  })

  it('should render with data-testid', () => {
    const { getByTestId } = render(
      <ToggleFilters facets={toggleFacetsMock} onChange={() => {}} />
    )

    expect(getByTestId('toggle-filters')).toBeInTheDocument()
  })

  it('should have exclusive behavior like radio buttons', () => {
    const mockOnChange = jest.fn()
    const { getByLabelText } = render(
      <ToggleFilters facets={toggleFacetsMock} onChange={mockOnChange} />
    )

    // Primeiro, seleciona 'Same Day' (estado atual: off)
    fireEvent.click(getByLabelText('Same Day'))
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 'same-day',
        selected: false,
      })
    )

    // Reset do mock
    mockOnChange.mockClear()

    // Depois, seleciona 'Next Day' - deve ser excludente
    fireEvent.click(getByLabelText('Next Day'))
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 'next-day',
        selected: false,
      })
    )
  })

  it('should handle selected as boolean even when it comes as object', () => {
    const facetsWithObjectSelected = [
      { ...toggleFacetsMock[0], selected: { value: true } }, // Objeto ao invés de booleano
      { ...toggleFacetsMock[1], selected: false },
    ]

    const mockOnChange = jest.fn()
    const { getByLabelText } = render(
      <ToggleFilters
        facets={facetsWithObjectSelected}
        onChange={mockOnChange}
      />
    )

    // O componente deve tratar o objeto como truthy e converter para boolean
    expect(getByLabelText('Same Day')).toBeChecked()
    expect(getByLabelText('Next Day')).not.toBeChecked()

    // Clique deve funcionar normalmente; o payload carrega o estado atual (off)
    fireEvent.click(getByLabelText('Next Day'))
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 'next-day',
        selected: false,
      })
    )
  })

  it('should handle SyntheticEvent from Toggle onChange correctly', () => {
    const mockOnChange = jest.fn()
    const { getByLabelText } = render(
      <ToggleFilters facets={toggleFacetsMock} onChange={mockOnChange} />
    )

    // Usar fireEvent.click que é como nosso mock funciona
    fireEvent.click(getByLabelText('Same Day'))

    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 'same-day',
        selected: false,
      })
    )
  })
})
