/* eslint-env jest */
import { render } from '@vtex/test-tools/react'
import React from 'react'

import SearchFooter from '../components/SearchFooter'

describe('<SearchFooter /> component', () => {
  const renderComponent = customProps => {
    const props = {
      recordsFiltered: 20,
      page: 1,
      maxItemsPerPage: 5,
      runtime: { navigate: () => {} },
      getLinkProps: jest.fn(),
      ...customProps,
    }
    return render(<SearchFooter {...props} />)
  }

  it('should be rendered', () => {
    const { asFragment } = renderComponent()
    expect(asFragment()).toBeDefined()
  })

  it('should match snapshot', () => {
    const { asFragment } = renderComponent()
    expect(asFragment()).toMatchSnapshot()
  })
})
