import React from 'react'
import { render, fireEvent } from '@vtex/test-tools/react'

import FacetItem from '../../components/FacetItem'
import SettingsContext from '../../components/SettingsContext'

beforeEach(() => {
  jest.clearAllMocks()
})

const mockNavigate = jest.fn()

const mockProps = {
  navigateToFacet: mockNavigate,
  facetTitle: 'Color',
  facet: {
    id: '',
    quantity: 2,
    name: 'White',
    key: 'color',
    selected: false,
    value: 'white',
    link: null,
    linkEncoded: null,
    href: 'apparel---accessories/white?map=department,color',
    range: null,
    children: null,
    __typename: 'FacetValue',
    map: 'color',
  },
  className: 'color-classname',
  preventRouteChange: true,
}

describe('<FacetItem />', () => {
  const renderComponent = (customProps) => {
    const props = { ...mockProps, ...customProps }

    return render(<FacetItem {...props} />)
  }

  it('should call navigation callback on select', () => {
    const { getByTestId } = renderComponent()

    fireEvent.click(getByTestId('check-specification-color-white'))

    expect(mockNavigate).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith(
      expect.objectContaining({
        ...mockProps.facet,
        title: mockProps.facetTitle,
      }),
      mockProps.preventRouteChange
    )
  })

  it('should call navigation callback on unselect', () => {
    const clonedFacet = { ...mockProps.facet }

    clonedFacet.selected = true

    const { getByTestId } = renderComponent({ facet: clonedFacet })

    fireEvent.click(getByTestId('check-specification-color-white'))

    expect(mockNavigate).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith(
      expect.objectContaining({
        ...clonedFacet,
        title: mockProps.facetTitle,
      }),
      mockProps.preventRouteChange
    )
  })

  it('should give a feedback on select/unselect', () => {
    const { rerender, getByTestId } = renderComponent()

    expect(getByTestId('check-specification-color-white').checked).toEqual(
      false
    )

    const clonedFacet = { ...mockProps.facet }

    clonedFacet.selected = true

    rerender(<FacetItem {...mockProps} facet={clonedFacet} />)

    expect(getByTestId('check-specification-color-white').checked).toEqual(true)
  })

  it('should render the quantity when the showFacetQuantity is true', () => {
    const { getByTestId } = render(
      <SettingsContext.Provider value={{ showFacetQuantity: true }}>
        <FacetItem {...mockProps} />
      </SettingsContext.Provider>
    )

    expect(getByTestId('facet-quantity-white-2')).toBeInTheDocument()
  })

  it('should add a suffix when the id is a reserved variable', () => {
    const clonedFacet = { ...mockProps.facet }

    clonedFacet.value = 'global'

    const { getByTestId } = renderComponent({ facet: clonedFacet })

    expect(
      getByTestId('check-specification-filterItem--color-global')
    ).toBeInTheDocument()
  })
})
