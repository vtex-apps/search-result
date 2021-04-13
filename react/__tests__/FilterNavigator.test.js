/* eslint-disable jest/no-mocks-import */
/* eslint-env jest */
import React from 'react'
import { render, fireEvent } from '@vtex/test-tools/react'
import categoriesTree from 'categoriesTree'
import { useDevice } from 'vtex.device-detector'

import FilterNavigator from '../FilterNavigator'
import QueryContext from '../components/QueryContext'
import { useRuntime } from '../__mocks__/vtex.render-runtime'
import FilterNavigatorContext from '../components/FilterNavigatorContext'
import specifications from '../__mocks__/specifications'

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

  useDevice.mockImplementation(() => ({ isMobile: false }))
})

describe('<FilterNavigator />', () => {
  const renderComponent = (customProps = { query: 'clothing', map: 'c' }) => {
    const props = {
      map: customProps.map || 'c',
      tree: categoriesTree,
      queryArgs: { query: customProps.query, map: customProps.map || 'c' },
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

  it('should be able to render a selected category with no children', () => {
    const tree = [
      {
        name: 'Clothing',
        link: '/Clothing',
        quantity: 0,
        selected: true,
      },
    ]

    const { getByText } = renderComponent({
      query: 'Clothing',
      tree,
    })

    expect(getByText(/Clothing/)).toBeInTheDocument()
  })

  it('should add unselected category on click', () => {
    const { getByText } = renderComponent({ query: 'Eletrônicos' })

    fireEvent.click(getByText(/Smartphones/))

    expect(mockNavigate).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith(
      expect.objectContaining({
        to: '/eletronicos/smartphones',
        query: '',
      })
    )
  })

  it('should remove selected category on click', () => {
    const tree = JSON.parse(JSON.stringify(categoriesTree))

    const selectedDepartment = tree.find(
      (department) => department.value === 'eletronicos'
    )

    selectedDepartment.selected = true

    selectedDepartment.children.find(
      (category) => category.value === 'smartphones'
    ).selected = true

    const { getByText } = renderComponent({
      query: 'eletronicos/smartphones',
      tree,
    })

    fireEvent.click(getByText(/Smartphones/))

    expect(mockNavigate).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith(
      expect.objectContaining({
        to: '/eletronicos',
        query: '',
      })
    )
  })

  it('should allow to add a root category when there is no categories selected', () => {
    const { getByText } = renderComponent({ query: 'fulltextterm', map: 'ft' })

    fireEvent.click(getByText(/Eletrônicos/))

    expect(mockNavigate).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith(
      expect.objectContaining({
        to: '/fulltextterm/eletronicos',
      })
    )
  })

  it('should not allow to remove a root category when there is a children selected', () => {
    const tree = JSON.parse(JSON.stringify(categoriesTree))

    const selectedDepartment = tree.find(
      (department) => department.value === 'eletronicos'
    )

    selectedDepartment.selected = true

    selectedDepartment.children.find(
      (category) => category.value === 'smartphones'
    ).selected = true

    const { getByText } = renderComponent({
      query: 'eletronicos/smartphones',
      tree,
    })

    fireEvent.click(getByText(/Eletrônicos/))

    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('should allow to remove a root category when it is a fulltext search', () => {
    const tree = JSON.parse(JSON.stringify(categoriesTree))

    const selectedDepartment = tree.find(
      (department) => department.value === 'eletronicos'
    )

    selectedDepartment.selected = true

    const { getByText } = renderComponent({
      query: 'fulltextterm',
      map: 'ft',
      tree,
    })

    fireEvent.click(getByText(/Eletrônicos/))

    expect(mockNavigate).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith(
      expect.objectContaining({
        to: '/fulltextterm',
      })
    )
  })

  it('should add unselected specification on click', () => {
    const { getByTestId } = renderComponent({
      specificationFilters: specifications,
      filters: specifications,
      tree: [],
    })

    fireEvent.click(getByTestId('check-specification-color-pink'))

    expect(mockNavigate).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith(
      expect.objectContaining({
        to: '/pink',
        query: 'map=color',
      })
    )
  })

  it('should remove selected specification on click', () => {
    const filters = JSON.parse(JSON.stringify(specifications))

    filters
      .find((filter) => filter.title === 'store/search.filter.title.color')
      .facets.find(
        (filterOption) => filterOption.value === 'pink'
      ).selected = true

    const { getAllByTestId } = renderComponent({
      query: 'top/pink',
      map: 'ft,map',
      specificationFilters: filters,
      filters,
      tree: [],
    })

    const [checkBox] = getAllByTestId('check-specification-color-pink')

    fireEvent.click(checkBox)

    expect(mockNavigate).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith(
      expect.objectContaining({
        to: '/top',
        query: 'map=ft',
      })
    )
  })

  it('should navigate to root category on key down', () => {
    const { getByTestId } = renderComponent({
      query: 'fulltextterm',
      map: 'ft',
    })

    fireEvent.keyDown(getByTestId('root-category-eletronicos'), {
      key: 'Enter',
      code: 'Enter',
    })

    expect(mockNavigate).toHaveBeenCalledTimes(1)
  })

  it('should navigate to child category on key down', () => {
    const tree = JSON.parse(JSON.stringify(categoriesTree))

    const selectedDepartment = tree.find(
      (department) => department.value === 'eletronicos'
    )

    selectedDepartment.selected = true

    const { getByTestId } = renderComponent({
      query: '/eletronicos',
      map: 'c',
      tree,
    })

    fireEvent.keyDown(getByTestId('categoryItem-Smartphones'), {
      key: 'Enter',
      code: 'Enter',
    })

    expect(mockNavigate).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith(
      expect.objectContaining({
        to: '/eletronicos/smartphones',
      })
    )
  })

  it('should navigate to child category on key down when categoryFiltersMode is href', () => {
    const tree = JSON.parse(JSON.stringify(categoriesTree))

    const selectedDepartment = tree.find(
      (department) => department.value === 'eletronicos'
    )

    selectedDepartment.selected = true

    const { getByTestId } = renderComponent({
      query: '/eletronicos',
      map: 'c',
      tree,
      categoryFiltersMode: 'href',
    })

    fireEvent.keyDown(getByTestId('categoryItem-Smartphones'), {
      key: 'Enter',
      code: 'Enter',
    })

    expect(mockNavigate).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith(
      expect.objectContaining({
        to: '/eletronicos/smartphones',
      })
    )
  })

  it('should remove category on key down', () => {
    const tree = JSON.parse(JSON.stringify(categoriesTree))

    const selectedDepartment = tree.find(
      (department) => department.value === 'eletronicos'
    )

    selectedDepartment.children.find(
      (category) => category.value === 'smartphones'
    ).selected = true

    selectedDepartment.selected = true

    const { getByTestId } = renderComponent({
      query: '/eletronicos/smartphones',
      map: 'c,c',
      tree,
    })

    fireEvent.keyDown(getByTestId('selected-category-smartphones'), {
      key: 'Enter',
      code: 'Enter',
    })

    expect(mockNavigate).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith(
      expect.objectContaining({
        to: '/eletronicos',
      })
    )
  })

  it('should navigate properly when categoryFiltersMode is href', () => {
    const { getByText } = renderComponent({
      query: 'Eletrônicos',
      categoryFiltersMode: 'href',
    })

    fireEvent.click(getByText(/Smartphones/))

    expect(mockNavigate).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith(
      expect.objectContaining({
        to: '/eletronicos/smartphones',
        query: '',
      })
    )
  })

  it('should be able to clear all selected options from a specification', () => {
    const filters = JSON.parse(JSON.stringify(specifications))

    filters
      .find((filter) => filter.title === 'store/search.filter.title.color')
      .facets.find(
        (filterOption) => filterOption.value === 'green'
      ).selected = true

    filters
      .find((filter) => filter.title === 'store/search.filter.title.color')
      .facets.find(
        (filterOption) => filterOption.value === 'white'
      ).selected = true

    filters
      .find((filter) => filter.title === 'Size')
      .facets.find(
        (filterOption) => filterOption.value === '40'
      ).selected = true

    const { getAllByText } = renderComponent({
      showClearByFilter: true,
      specificationFilters: filters,
      filters,
      tree: [],
      query: '40/green/white',
      map: 'size,color,color',
    })

    fireEvent.click(getAllByText('Clear')[0])

    expect(mockNavigate).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith(
      expect.objectContaining({
        to: '/40',
        query: 'map=size',
      })
    )
  })

  it('should open only one filter', () => {
    const { getByTestId, queryByTestId, getByText } = renderComponent({
      openFiltersMode: 'one',
      filters: specifications,
      specificationFilters: specifications,
    })

    fireEvent.click(getByText('Color'))

    expect(getByTestId('check-specification-color-white')).toBeInTheDocument()
    expect(queryByTestId('check-specification-size-40')).toBeNull()

    fireEvent.click(getByText('Size'))

    expect(getByTestId('check-specification-size-40')).toBeInTheDocument()
    expect(queryByTestId('check-specification-color-white')).toBeNull()
  })

  it('should close on outsideClick', () => {
    const { getByTestId, queryByTestId, getByText } = render(
      <div>
        <QueryContext.Provider value={{ query: '/searchterm', map: 'ft' }}>
          <FilterNavigatorContext.Provider
            value={{ query: '/searchterm', map: 'ft' }}
          >
            <FilterNavigator
              openFiltersMode="one"
              filters={specifications}
              specificationFilters={specifications}
              closeOnOutsideClick
            />
          </FilterNavigatorContext.Provider>
        </QueryContext.Provider>
        <span>Outside</span>
      </div>
    )

    fireEvent.click(getByText('Color'))

    expect(getByTestId('check-specification-color-white')).toBeInTheDocument()

    fireEvent.mouseDown(getByText('Outside'))

    expect(queryByTestId('check-specification-color-white')).toBeNull()
  })

  it('should not close on outsideClick if mode is not one', () => {
    const { getByTestId, getByText } = render(
      <div>
        <QueryContext.Provider value={{ query: '/searchterm', map: 'ft' }}>
          <FilterNavigatorContext.Provider
            value={{ query: '/searchterm', map: 'ft' }}
          >
            <FilterNavigator
              openFiltersMode="many"
              filters={specifications}
              specificationFilters={specifications}
              closeOnOutsideClick
            />
          </FilterNavigatorContext.Provider>
        </QueryContext.Provider>
        <span>Outside</span>
      </div>
    )

    fireEvent.mouseDown(getByText('Outside'))

    expect(getByTestId('check-specification-color-white')).toBeInTheDocument()
  })
})
