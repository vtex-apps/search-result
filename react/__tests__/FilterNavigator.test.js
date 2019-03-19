/* eslint-env jest */
import React from 'react'
import { render } from '@vtex/test-tools/react'

import categoriesTree, { numberOfFilters } from 'categoriesTree'

import FilterNavigator from '../FilterNavigator'

describe('<FilterNavigator />', () => {
  const renderComponent = customProps => {
    const getLinkProps = jest.fn().mockImplementation(pageNumber => {
      return {
        page: `mockedPage${pageNumber}`,
        params: 'mockedParams',
      }
    })
    const props = {
      getLinkProps,
      map: 'c',
      rest: '',
      tree: categoriesTree,
      ...customProps,
    }

    return { ...render(<FilterNavigator {...props} />), getLinkProps }
  }

  it('should call getLinkProps on render', () => {
    const { getLinkProps } = renderComponent()

    // Expect getLinkProps has been called
    expect(getLinkProps).toBeCalledTimes(numberOfFilters)
  })

  it('should match snapshot with all', () => {
    const { asFragment } = renderComponent()

    expect(asFragment()).toMatchSnapshot()
  })

  it('should display related categories', () => {
    const { asFragment } = renderComponent({ query: 'Livros' })

    expect(asFragment()).toMatchSnapshot()
  })
})
