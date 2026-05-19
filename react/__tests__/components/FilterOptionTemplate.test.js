/* eslint-disable jest/no-mocks-import */
import React from 'react'
import { fireEvent, render } from '@vtex/test-tools/react'
import { useRuntime } from 'vtex.render-runtime'
import { useDeliveryPromiseState } from 'vtex.delivery-promise-components/DeliveryPromiseContext'
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

  useDeliveryPromiseState.mockReturnValue({ deliveryPromiseMethod: null })
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
  const renderComponent = customProps => {
    const props = { ...mockProps, ...customProps }

    return render(
      <SettingsContext.Provider value={{ thresholdForFacetSearch: 10 }}>
        <FilterOptionTemplate {...props}>
          {facet => (
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

  const radioFiltersMock = [
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

  const deliveryOptionsFiltersMock = [
    {
      key: 'delivery-options',
      name: 'Express',
      value: 'express',
      selected: false,
      quantity: 1,
      map: 'delivery-options',
    },
    {
      key: 'delivery-options',
      name: 'Standard',
      value: 'standard',
      selected: false,
      quantity: 1,
      map: 'delivery-options',
    },
  ]

  const toggleFiltersMock = [
    {
      key: 'dynamic-estimate',
      name: 'Same Day',
      value: 'same-day',
      selected: false,
      quantity: 1,
      map: 'dynamic-estimate',
    },
    {
      key: 'dynamic-estimate',
      name: 'Next Day',
      value: 'next-day',
      selected: false,
      quantity: 1,
      map: 'dynamic-estimate',
    },
  ]

  it('should render RadioFilters and handle radio selection', () => {
    const mockNavigateRadio = jest.fn()
    const radioProps = {
      ...mockProps,
      filters: radioFiltersMock,
      title: 'Shipping',
      navigateToFacet: mockNavigateRadio,
      isSelectedFiltersSection: false,
    }

    const { getByLabelText, getByTestId } = render(
      <SettingsContext.Provider value={{ thresholdForFacetSearch: 10 }}>
        <FilterOptionTemplate {...radioProps}>
          {/* children required */}
          {() => null}
        </FilterOptionTemplate>
      </SettingsContext.Provider>
    )

    expect(getByTestId('radio-filters')).toBeInTheDocument()

    const deliveryRadio = getByLabelText('Delivery')
    const pickupRadio = getByLabelText('Pickup')

    fireEvent.click(deliveryRadio)
    expect(mockNavigateRadio).toHaveBeenCalled()

    fireEvent.click(pickupRadio)
    expect(mockNavigateRadio).toHaveBeenCalled()
  })

  it('should render RadioButton for shipping filter', () => {
    const shippingProps = {
      ...mockProps,
      filters: radioFiltersMock,
      title: 'Shipping',
    }

    const { getByText, getByTestId } = renderComponent(shippingProps)

    expect(getByTestId('radio-filters')).toBeInTheDocument()

    expect(getByText('Delivery')).toBeInTheDocument()
    expect(getByText('Pickup')).toBeInTheDocument()
  })

  it('should render RadioButton for delivery-options filter', () => {
    const deliveryOptionsProps = {
      ...mockProps,
      filters: deliveryOptionsFiltersMock,
      title: 'Delivery Options',
    }

    const { getByText, getByTestId } = renderComponent(deliveryOptionsProps)

    expect(getByTestId('radio-filters')).toBeInTheDocument()
    expect(getByText('Express')).toBeInTheDocument()
    expect(getByText('Standard')).toBeInTheDocument()
  })

  it('should render ToggleFilters for dynamic-estimate filter', () => {
    const toggleProps = {
      ...mockProps,
      filters: toggleFiltersMock,
      title: 'Delivery Estimate',
    }

    const { getByText, getByTestId } = renderComponent(toggleProps)

    expect(getByTestId('toggle-filters')).toBeInTheDocument()
    expect(getByText('Same Day')).toBeInTheDocument()
    expect(getByText('Next Day')).toBeInTheDocument()
  })

  it('should handle toggle interactions', () => {
    const mockNavigateToggle = jest.fn()
    const toggleProps = {
      ...mockProps,
      filters: toggleFiltersMock,
      title: 'Delivery Estimate',
      navigateToFacet: mockNavigateToggle,
      isSelectedFiltersSection: false,
    }

    const { getByLabelText, getByTestId } = render(
      <SettingsContext.Provider value={{ thresholdForFacetSearch: 10 }}>
        <FilterOptionTemplate {...toggleProps}>
          {() => null}
        </FilterOptionTemplate>
      </SettingsContext.Provider>
    )

    expect(getByTestId('toggle-filters')).toBeInTheDocument()

    const sameDayToggle = getByLabelText('Same Day')
    const nextDayToggle = getByLabelText('Next Day')

    fireEvent.click(sameDayToggle)
    expect(mockNavigateToggle).toHaveBeenCalled()

    fireEvent.click(nextDayToggle)
    expect(mockNavigateToggle).toHaveBeenCalled()
  })

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

  describe('dynamic-estimate toggle filter translation (FR-006 precedence)', () => {
    const makeDynamicEstimateFilter = keys =>
      keys.map(key => ({
        key: 'dynamic-estimate',
        name: key,
        value: key,
        selected: false,
        quantity: 1,
        map: 'dynamic-estimate',
      }))

    const renderToggleFilter = (keys, deliveryPromiseMethod = null) => {
      useDeliveryPromiseState.mockReturnValue({ deliveryPromiseMethod })
      const filters = makeDynamicEstimateFilter(keys)

      return render(
        <SettingsContext.Provider value={{ thresholdForFacetSearch: 10 }}>
          <FilterOptionTemplate
            {...mockProps}
            filters={filters}
            title="Delivery Estimate"
          >
            {() => null}
          </FilterOptionTemplate>
        </SettingsContext.Provider>
      )
    }

    // FR-001 – FR-004: new prefixed values render as humanized copy
    it('renders delivery-same-day as "Receive Today" regardless of shipping method', () => {
      const methods = [null, 'delivery', 'pickup-in-point']

      methods.forEach(method => {
        const { getByLabelText, unmount } = renderToggleFilter(
          ['delivery-same-day'],
          method
        )

        expect(getByLabelText('Receive Today')).toBeInTheDocument()
        unmount()
      })
    })

    it('renders delivery-next-day as "Receive Tomorrow" regardless of shipping method', () => {
      const methods = [null, 'delivery', 'pickup-in-point']

      methods.forEach(method => {
        const { getByLabelText, unmount } = renderToggleFilter(
          ['delivery-next-day'],
          method
        )

        expect(getByLabelText('Receive Tomorrow')).toBeInTheDocument()
        unmount()
      })
    })

    it('renders pickup-same-day as "Pickup Today" regardless of shipping method', () => {
      const methods = [null, 'delivery', 'pickup-in-point']

      methods.forEach(method => {
        const { getByLabelText, unmount } = renderToggleFilter(
          ['pickup-same-day'],
          method
        )

        expect(getByLabelText('Pickup Today')).toBeInTheDocument()
        unmount()
      })
    })

    it('renders pickup-next-day as "Pickup Tomorrow" regardless of shipping method', () => {
      const methods = [null, 'delivery', 'pickup-in-point']

      methods.forEach(method => {
        const { getByLabelText, unmount } = renderToggleFilter(
          ['pickup-next-day'],
          method
        )

        expect(getByLabelText('Pickup Tomorrow')).toBeInTheDocument()
        unmount()
      })
    })

    // FR-006 step 2: legacy synthesis with shipping method selected
    it('synthesizes same-day to "Receive Today" when delivery is selected', () => {
      const { getByLabelText } = renderToggleFilter(['same-day'], 'delivery')

      expect(getByLabelText('Receive Today')).toBeInTheDocument()
    })

    it('synthesizes next-day to "Receive Tomorrow" when delivery is selected', () => {
      const { getByLabelText } = renderToggleFilter(['next-day'], 'delivery')

      expect(getByLabelText('Receive Tomorrow')).toBeInTheDocument()
    })

    it('synthesizes same-day to "Pickup Today" when pickup-in-point is selected', () => {
      const { getByLabelText } = renderToggleFilter(
        ['same-day'],
        'pickup-in-point'
      )

      expect(getByLabelText('Pickup Today')).toBeInTheDocument()
    })

    it('synthesizes next-day to "Pickup Tomorrow" when pickup-in-point is selected', () => {
      const { getByLabelText } = renderToggleFilter(
        ['next-day'],
        'pickup-in-point'
      )

      expect(getByLabelText('Pickup Tomorrow')).toBeInTheDocument()
    })

    // FR-006 step 3: legacy bare fallback when no method is selected
    it('falls back to "Same day" for same-day when no shipping method is selected', () => {
      const { getByLabelText } = renderToggleFilter(['same-day'], null)

      expect(getByLabelText('Same day')).toBeInTheDocument()
    })

    it('falls back to "Next day" for next-day when no shipping method is selected', () => {
      const { getByLabelText } = renderToggleFilter(['next-day'], null)

      expect(getByLabelText('Next day')).toBeInTheDocument()
    })

    // FR-007: unknown key falls back to raw facet.name
    it('renders raw facet name for unknown keys', () => {
      const { getByLabelText } = renderToggleFilter(
        ['delivery-2-days'],
        'delivery'
      )

      expect(getByLabelText('delivery-2-days')).toBeInTheDocument()
    })

    // Edge case: no double-prefixing of new API values
    it('does not double-prefix delivery-same-day when delivery is selected', () => {
      const { queryByLabelText, getByLabelText } = renderToggleFilter(
        ['delivery-same-day'],
        'delivery'
      )

      expect(getByLabelText('Receive Today')).toBeInTheDocument()
      expect(
        queryByLabelText('delivery-delivery-same-day')
      ).not.toBeInTheDocument()
    })

    it('does not double-prefix pickup-next-day when pickup-in-point is selected', () => {
      const { queryByLabelText, getByLabelText } = renderToggleFilter(
        ['pickup-next-day'],
        'pickup-in-point'
      )

      expect(getByLabelText('Pickup Tomorrow')).toBeInTheDocument()
      expect(queryByLabelText('pickup-pickup-next-day')).not.toBeInTheDocument()
    })

    // US2-AC4: mixed legacy + new values render correctly together
    it('handles mixed legacy and new API values in the same filter', () => {
      renderToggleFilter(['same-day', 'delivery-same-day'], 'delivery')

      // legacy same-day synthesized to delivery → "Receive Today"
      // delivery-same-day also resolves to "Receive Today" — both render as the same text
      const labels = document.querySelectorAll('label')
      const texts = Array.from(labels).map(l => l.textContent)

      expect(texts.filter(t => t === 'Receive Today')).toHaveLength(2)
    })
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
