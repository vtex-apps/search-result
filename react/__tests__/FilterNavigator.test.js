/* eslint-env jest */
import React from 'react'
import { render } from '@vtex/test-tools/react'

import categoriesTree from 'categoriesTree'

import FilterNavigator from '../FilterNavigator'
import QueryContext from '../components/QueryContext'

describe('<FilterNavigator />', () => {
  const renderComponent = (customProps = { query: 'clothing' }) => {
    const props = {
      map: 'c',
      tree: categoriesTree,
      ...customProps,
    }

    return render(
      <QueryContext.Provider
        value={{ query: customProps.query, map: props.map }}
      >
        <FilterNavigator {...props} />
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
