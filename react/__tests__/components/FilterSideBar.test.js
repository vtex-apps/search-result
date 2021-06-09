/* eslint-disable jest/no-mocks-import */
/* eslint-env jest */
import React from 'react'
import { fireEvent, render } from '@vtex/test-tools/react'
import categoriesTree from 'categoriesTree'
import { useDevice } from 'vtex.device-detector'

import QueryContext from '../../components/QueryContext'
import { useRuntime } from '../../__mocks__/vtex.render-runtime'
import FilterNavigatorContext from '../../components/FilterNavigatorContext'
import specifications from '../../__mocks__/specifications'
import FilterNavigator from '../../FilterNavigator'

const mockUseRuntime = useRuntime

const mockNavigate = jest.fn()
const mockSetQuery = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()

  mockUseRuntime.mockImplementation(() => ({
    navigate: mockNavigate,
    setQuery: mockSetQuery,
    getSettings: () => ({}),
    query: {},
  }))

  useDevice.mockImplementation(() => ({
    isMobile: true,
  }))
})

describe('<FilterNavigator />', () => {
  const renderComponent = (
    customProps = { query: 'fulltextterm', map: 'ft' }
  ) => {
    const props = {
      map: customProps.map,
      tree: categoriesTree,
      queryArgs: { query: customProps.query, map: customProps.map },
      specificationFilters: specifications,
      filters: specifications,
      ...customProps,
    }

    return render(
      <QueryContext.Provider
        value={{ query: customProps.query, map: props.map }}
      >
        <FilterNavigatorContext.Provider
          value={{ query: customProps.query, map: props.map }}
        >
          <FilterNavigator {...props} />
        </FilterNavigatorContext.Provider>
      </QueryContext.Provider>
    )
  }

  it('should add a unselected specification', () => {
    const { getByText } = renderComponent()

    fireEvent.click(getByText('Color'))
    fireEvent.click(getByText('White'))
    fireEvent.click(getByText('Apply'))

    expect(mockNavigate).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith(
      expect.objectContaining({
        to: '/fulltextterm/white',
      })
    )
  })

  it('should remove a selected specification', () => {
    const filters = JSON.parse(JSON.stringify(specifications))

    filters
      .find((filter) => filter.title === 'store/search.filter.title.color')
      .facets.find(
        (filterOption) => filterOption.value === 'white'
      ).selected = true

    const { getByText } = renderComponent({
      specificationFilters: filters,
      filters,
      query: 'fulltextterm/white',
      map: 'ft,color',
    })

    fireEvent.click(getByText('Color'))
    fireEvent.click(getByText('White'))
    fireEvent.click(getByText('Apply'))

    expect(mockNavigate).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith(
      expect.objectContaining({
        to: '/fulltextterm',
      })
    )
  })

  it('should add a unselected category', () => {
    const { getByText } = renderComponent()

    fireEvent.click(getByText('Departments'))
    fireEvent.click(getByText('Eletrônicos'))
    fireEvent.click(getByText('Smartphones'))
    fireEvent.click(getByText('Apply'))

    expect(mockNavigate).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith(
      expect.objectContaining({
        to: '/fulltextterm/eletronicos/smartphones',
      })
    )
  })

  it('should not add a unselected specification when it is selected and unselected right after', () => {
    const { getByText } = renderComponent()

    fireEvent.click(getByText('Color'))
    fireEvent.click(getByText('White'))
    fireEvent.click(getByText('White'))
    fireEvent.click(getByText('Apply'))

    expect(mockNavigate).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith(
      expect.objectContaining({
        to: '/fulltextterm',
      })
    )
  })

  it('should clear all specifications and categories on button click', () => {
    const filters = JSON.parse(JSON.stringify(specifications))

    filters
      .find((filter) => filter.title === 'store/search.filter.title.color')
      .facets.find(
        (filterOption) => filterOption.value === 'white'
      ).selected = true

    filters
      .find((filter) => filter.title === 'store/search.filter.title.color')
      .facets.find(
        (filterOption) => filterOption.value === 'green'
      ).selected = true

    const { getByText } = renderComponent({
      specificationFilters: filters,
      filters,
      query: 'fulltextterm/green/white',
      map: 'ft,color,color',
    })

    fireEvent.click(getByText('Clear'))
    fireEvent.click(getByText('Apply'))

    expect(mockNavigate).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith(
      expect.objectContaining({
        to: '/fulltextterm',
      })
    )
  })

  it('should navigate right after specification selection when updateOnFilterSelectionOnMobile is true', () => {
    const { getByText } = renderComponent({
      query: 'fulltextterm',
      map: 'ft',
      updateOnFilterSelectionOnMobile: true,
      preventRouteChange: true,
    })

    fireEvent.click(getByText('Color'))
    fireEvent.click(getByText('White'))

    expect(mockSetQuery).toHaveBeenCalledTimes(1)
    expect(mockSetQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        map: 'ft,color',
        query: '/fulltextterm/white',
      })
    )

    fireEvent.click(getByText('Apply'))

    expect(mockSetQuery).toHaveBeenCalledTimes(1)
  })

  it('should navigate right after category selection when updateOnFilterSelectionOnMobile is true', () => {
    const { getByText } = renderComponent({
      query: 'fulltextterm',
      map: 'ft',
      updateOnFilterSelectionOnMobile: true,
      preventRouteChange: true,
    })

    fireEvent.click(getByText('Departments'))
    fireEvent.click(getByText('Smartphones'))

    expect(mockSetQuery).toHaveBeenCalledTimes(1)
    expect(mockSetQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        map: 'ft,c,c',
        query: '/fulltextterm/eletronicos/smartphones',
      })
    )

    fireEvent.click(getByText('Apply'))

    expect(mockSetQuery).toHaveBeenCalledTimes(1)
  })

  it('should clear all specifications right after click on Clear button when the updateOnFilterSelectionOnMobile is true', () => {
    const filters = JSON.parse(JSON.stringify(specifications))

    filters
      .find((filter) => filter.title === 'store/search.filter.title.color')
      .facets.find(
        (filterOption) => filterOption.value === 'white'
      ).selected = true

    const { getByText } = renderComponent({
      specificationFilters: filters,
      filters,
      query: 'fulltextterm/white',
      map: 'ft,color',
      preventRouteChange: true,
      updateOnFilterSelectionOnMobile: true,
    })

    fireEvent.click(getByText('Clear'))

    expect(mockSetQuery).toHaveBeenCalledTimes(1)
    expect(mockSetQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        query: '/fulltextterm',
        map: 'ft',
      })
    )
  })

  it('should not clear categories on Clear click', () => {
    const { getByText } = renderComponent()

    fireEvent.click(getByText('Departments'))
    fireEvent.click(getByText('Eletrônicos'))
    fireEvent.click(getByText('Smartphones'))

    fireEvent.click(getByText('Clear'))
    fireEvent.click(getByText('Apply'))

    expect(mockNavigate).toHaveBeenCalledWith(
      expect.objectContaining({
        to: '/fulltextterm/eletronicos/smartphones',
      })
    )
  })

  it('should clear the selected options from a specification on Clear by specification button', () => {
    const filters = JSON.parse(JSON.stringify(specifications))

    filters
      .find((filter) => filter.title === 'store/search.filter.title.color')
      .facets.find(
        (filterOption) => filterOption.value === 'white'
      ).selected = true

    const { getByText, getAllByText } = renderComponent({
      specificationFilters: filters,
      filters,
      query: 'fulltextterm/white',
      map: 'ft,color',
      showClearByFilter: true,
    })

    fireEvent.click(getAllByText('Clear')[0])
    fireEvent.click(getByText('Apply'))

    expect(mockNavigate).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith(
      expect.objectContaining({
        to: '/fulltextterm',
      })
    )
  })
})
