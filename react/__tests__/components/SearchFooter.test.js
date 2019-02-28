/* eslint-env jest */
import { render } from 'test-utils'
import React from 'react'
import { IconCaret } from 'vtex.dreamstore-icons'

import SearchFooter from '../../components/SearchFooter'

describe('<SearchFooter /> component', () => {
  let renderComponent = null
  const defaultProps = {
    recordsFiltered: 20,
    page: 1,
    maxItemsPerPage: 5,
    runtime: { navigate: () => {} },
    getLinkProps: jest.fn(),
  }

  beforeEach(() => {
    renderComponent = customProps => {
      const props = {
        ...defaultProps,
        ...customProps,
      }
      return render(<SearchFooter {...props} />)
    }
  })

  it('should be rendered', () => {
    const { asFragment } = renderComponent()
    expect(asFragment()).toBeDefined()
  })

  it('should be rendered', () => {
    const { asFragment } = renderComponent()
    expect(asFragment()).toMa
  })
})
