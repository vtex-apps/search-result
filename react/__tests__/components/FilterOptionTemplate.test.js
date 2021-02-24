/* eslint-disable jest/no-mocks-import */
import React from 'react'
import { fireEvent, render } from '@vtex/test-tools/react'
import { useRuntime } from 'vtex.render-runtime'
import { mockAllIsIntersecting } from 'react-intersection-observer/test-utils'

import FilterOptionTemplate from '../../components/FilterOptionTemplate'
import FacetItem from '../../components/FacetItem'
import SettingsContext from '../../components/SettingsContext'
import '../../__mocks__/intersectionObserverMock'
import specifications from '../../__mocks__/specifications'

beforeEach(() => {
  jest.clearAllMocks()

  useRuntime.mockImplementation(() => ({
    getSettings: () => ({}),
  }))
})

const mockNavigate = jest.fn()
const mockSetTruncatedFacetsFetched = jest.fn()

const mockProps = {
  id: 'color',
  title: 'Color',
  quantity: 13,
  filters: [
    {
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
    {
      id: '',
      quantity: 1,
      name: 'Grey',
      key: 'color',
      selected: true,
      value: 'grey',
      link: null,
      linkEncoded: null,
      href: 'apparel---accessories/grey?map=department,color',
      range: null,
      children: null,
      __typename: 'FacetValue',
      map: 'color',
    },
    {
      id: '',
      quantity: 2,
      name: 'Pink',
      key: 'color',
      selected: true,
      value: 'pink',
      link: null,
      linkEncoded: null,
      href: 'apparel---accessories/pink?map=department,color',
      range: null,
      children: null,
      __typename: 'FacetValue',
      map: 'color',
    },
    {
      id: '',
      quantity: 6,
      name: 'Green',
      key: 'color',
      selected: false,
      value: 'green',
      link: null,
      linkEncoded: null,
      href: 'apparel---accessories/green?map=department,color',
      range: null,
      children: null,
      __typename: 'FacetValue',
      map: 'color',
    },
    {
      id: '',
      quantity: 1,
      name: 'Light green',
      key: 'color',
      selected: false,
      value: 'light-green',
      link: null,
      linkEncoded: null,
      href: 'apparel---accessories/light-green?map=department,color',
      range: null,
      children: null,
      __typename: 'FacetValue',
      map: 'color',
    },
    {
      id: '',
      quantity: 2,
      name: 'Blue',
      key: 'color',
      selected: false,
      value: 'blue',
      link: null,
      linkEncoded: null,
      href: 'apparel---accessories/blue?map=department,color',
      range: null,
      children: null,
      __typename: 'FacetValue',
      map: 'color',
    },
    {
      id: '',
      quantity: 1,
      name: 'Light blue',
      key: 'color',
      selected: false,
      value: 'light-blue',
      link: null,
      linkEncoded: null,
      href: 'apparel---accessories/light-blue?map=department,color',
      range: null,
      children: null,
      __typename: 'FacetValue',
      map: 'color',
    },
    {
      id: '',
      quantity: 2,
      name: 'Brown',
      key: 'color',
      selected: false,
      value: 'brown',
      link: null,
      linkEncoded: null,
      href: 'apparel---accessories/brown?map=department,color',
      range: null,
      children: null,
      __typename: 'FacetValue',
      map: 'color',
    },
    {
      id: '',
      quantity: 1,
      name: 'Fuchsia',
      key: 'color',
      selected: false,
      value: 'fuchsia',
      link: null,
      linkEncoded: null,
      href: 'apparel---accessories/fuchsia?map=department,color',
      range: null,
      children: null,
      __typename: 'FacetValue',
      map: 'color',
    },
    {
      id: '',
      quantity: 1,
      name: 'Yellow',
      key: 'color',
      selected: false,
      value: 'yellow',
      link: null,
      linkEncoded: null,
      href: 'apparel---accessories/yellow?map=department,color',
      range: null,
      children: null,
      __typename: 'FacetValue',
      map: 'color',
    },
    {
      id: '',
      quantity: 3,
      name: 'Red',
      key: 'color',
      selected: false,
      value: 'red',
      link: null,
      linkEncoded: null,
      href: 'apparel---accessories/red?map=department,color',
      range: null,
      children: null,
      __typename: 'FacetValue',
      map: 'color',
    },
    {
      id: '',
      quantity: 2,
      name: 'Black',
      key: 'color',
      selected: false,
      value: 'black',
      link: null,
      linkEncoded: null,
      href: 'apparel---accessories/black?map=department,color',
      range: null,
      children: null,
      __typename: 'FacetValue',
      map: 'color',
    },
    {
      id: '',
      quantity: 1,
      name: 'Rose',
      key: 'color',
      selected: false,
      value: 'rose',
      link: null,
      linkEncoded: null,
      href: 'apparel---accessories/rose?map=department,color',
      range: null,
      children: null,
      __typename: 'FacetValue',
      map: 'color',
    },
  ],
  lastOpenFilter: undefined,
  setLastOpenFilter: () => {},
  openFiltersMode: 'many',
  truncatedFacetsFetched: false,
  setTruncatedFacetsFetched: mockSetTruncatedFacetsFetched,
  appliedFiltersOverview: 'hide',
  navigateToFacet: mockNavigate,
  showClearByFilter: false,
  preventRouteChange: true,
  lazyRender: false,
}

describe('<FilterOptionTemplate />', () => {
  const renderComponent = (customProps) => {
    const props = { ...mockProps, ...customProps }

    return render(
      <SettingsContext.Provider value={{ thresholdForFacetSearch: 10 }}>
        <FilterOptionTemplate {...props}>
          {(facet) => (
            <FacetItem
              key={facet.name}
              facetTitle={facet.title}
              facet={facet}
              preventRouteChange={mockProps.preventRouteChange}
              navigateToFacet={mockNavigate}
            />
          )}
        </FilterOptionTemplate>
      </SettingsContext.Provider>
    )
  }

  it('should lazy render items', () => {
    useRuntime.mockImplementation(() => ({
      getSettings: () => {
        return { enableSearchRenderingOptimization: true }
      },
    }))

    const { queryByTestId } = renderComponent({ lazyRender: true })

    expect(queryByTestId('check-specification-color-white')).toBeNull()

    mockAllIsIntersecting(true)

    expect(queryByTestId('check-specification-color-white')).toBeInTheDocument()
  })

  it('should truncate items', () => {
    const { queryByTestId, getByText } = renderComponent({
      truncateFilters: true,
    })

    expect(
      queryByTestId('check-specification-color-yellow')
    ).toBeInTheDocument()

    expect(queryByTestId('check-specification-color-red')).toBeNull()

    fireEvent.click(getByText(/See 3 more/))

    expect(queryByTestId('check-specification-color-red')).toBeInTheDocument()

    fireEvent.click(getByText(/See less/))

    expect(queryByTestId('check-specification-color-red')).toBeNull()
  })

  it('should be able to collapse', () => {
    const { getByText, queryByTestId } = renderComponent()

    expect(queryByTestId('check-specification-color-white')).toBeInTheDocument()

    fireEvent.click(getByText('Color'))

    expect(queryByTestId('check-specification-color-white')).toBeNull()
  })

  it('should search for options', () => {
    const { getByTestId, queryByTestId } = renderComponent()

    expect(getByTestId('check-specification-color-white')).toBeInTheDocument()

    fireEvent.change(getByTestId('filter-search-bar'), {
      target: { value: 'yellow' },
    })

    expect(queryByTestId('check-specification-color-white')).toBeNull()
    expect(getByTestId('check-specification-color-yellow')).toBeInTheDocument()
  })

  it('should show filter overview', () => {
    const { getByText } = renderComponent({ appliedFiltersOverview: 'show' })

    expect(getByText('Grey, Pink')).toBeInTheDocument()
  })

  it('should throw an error if the openFiltersMode does not exist', () => {
    jest.spyOn(console, 'error').mockImplementation()

    const { getByText } = renderComponent({
      openFiltersMode: 'this-option-does-not-exist',
      fiters: specifications,
      specificationFilters: specifications,
    })

    fireEvent.click(getByText('Color'))

    expect(console.error).toHaveBeenLastCalledWith(
      'Invalid openFiltersMode value: this-option-does-not-exist\nCheck the documentation for the values available'
    )
  })

  it('should collapse on space keyDown', () => {
    const { getByText, queryByTestId } = renderComponent()

    expect(queryByTestId('check-specification-color-white')).toBeInTheDocument()

    fireEvent.keyDown(getByText('Color'), { key: 'a', code: 'KeyA' })

    expect(queryByTestId('check-specification-color-white')).toBeInTheDocument()

    fireEvent.keyDown(getByText('Color'), { key: ' ', code: 'Space' })

    expect(queryByTestId('check-specification-color-white')).toBeNull()
  })

  it('should render children even if it is not a function', () => {
    const { getByText } = render(
      <FilterOptionTemplate {...mockProps}>
        <span>Child component</span>
      </FilterOptionTemplate>
    )

    expect(getByText('Child component')).toBeInTheDocument()
  })

  it('should call setTruncatedFacetsFetched', () => {
    useRuntime.mockImplementation(() => ({
      getSettings: () => {
        return { enableFiltersFetchOptimization: true }
      },
    }))

    const { getByText } = renderComponent({
      truncatedFacetsFetched: false,
    })

    fireEvent.click(getByText(/See 3 more/))

    expect(mockSetTruncatedFacetsFetched).toHaveBeenCalledTimes(1)
  })

  it('should render options on scroll', () => {
    useRuntime.mockImplementation(() => ({
      getSettings: () => {
        return { enableSearchRenderingOptimization: true }
      },
    }))

    const { queryByTestId } = renderComponent({ lazyRender: true })

    mockAllIsIntersecting(true)

    expect(queryByTestId('check-specification-color-white')).toBeInTheDocument()
    expect(queryByTestId('check-specification-color-rose')).toBeNull()

    fireEvent.scroll(queryByTestId('scrollable-element'), {
      target: { scrollY: 100 },
    })

    expect(queryByTestId('check-specification-color-rose')).toBeInTheDocument()
  })
})
