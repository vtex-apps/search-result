/* eslint-env jest */
import { mount } from 'enzyme'
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
      return mount(<SearchFooter {...props} />)
    }
  })

  it('should be rendered', () => {
    expect(renderComponent()).toBeDefined()
  })

  it('should be render an IconCaret', () => {
    const component = renderComponent()
    expect(component.find(IconCaret).exists()).toBe(true)
  })
})
