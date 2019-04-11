/* eslint-env jest */
import React from 'react'
import { render } from '@vtex/test-tools/react'

import categoriesTree from 'categoriesTree'

import CategoryPanel from '../CategoryPanel'

describe('<CategoryPanel />', () => {
  const renderComponent = customProps => {
    const props = {
      tree: categoriesTree,
      ...customProps,
    }

    return render(<CategoryPanel {...props} />)
  }

  it('should match snapshot with 4 items per row', () => {
    const { asFragment } = renderComponent()

    expect(asFragment()).toMatchSnapshot()
  })

  it('should match snapshot with 2 items per row', () => {
    const { asFragment } = renderComponent({ quantityOfItemsPerRow: 2 })

    expect(asFragment()).toMatchSnapshot()
  })
})
