/* eslint-env jest */
import React from 'react'
import { render } from '@vtex/test-tools/react'

import categoriesTree from 'categoriesTree'

import FilterNavigator from '../FilterNavigator'
import QueryContext from '../components/QueryContext'

import { useRuntime } from '../__mocks__/vtex.render-runtime'
import FilterNavigatorContext from '../components/FilterNavigatorContext'
const mockUseRuntime = useRuntime

const mockNavigate = jest.fn()
const mockSetQuery = jest.fn()
beforeEach(() => {
  jest.clearAllMocks()

  mockUseRuntime.mockImplementation(() => ({
    navigate: mockNavigate,
    setQuery: mockSetQuery,
    getSettings: () => ({}),
  }))
})

describe('<FilterNavigator />', () => {
  const renderComponent = (customProps = { query: 'clothing' }) => {
    const props = {
      map: 'c',
      tree: categoriesTree,
      queryArgs: { query: customProps.query, map: 'c' },
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

  it('should match snapshot with all', () => {
    const { asFragment } = renderComponent()

    expect(asFragment()).toMatchSnapshot()
  })

  it('should display related categories', () => {
    const { asFragment } = renderComponent({ query: 'Livros' })

    expect(asFragment()).toMatchSnapshot()
  })
})
