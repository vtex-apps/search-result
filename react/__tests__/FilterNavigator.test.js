/* eslint-env jest */
import React from 'react'
import { render } from '@vtex/test-tools/react'

import categoriesTree from 'categoriesTree'

import FilterNavigator from '../FilterNavigator'

describe('<FilterNavigator />', () => {
  const renderComponent = customProps => {
    const props = {
      getLinkProps: () => ({ page: 'mokedPage' }),
      map: 'c',
      rest: '',
      tree: categoriesTree,
      ...customProps,
    }

    return render(<FilterNavigator {...props} />)
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
