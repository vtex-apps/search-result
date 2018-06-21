/* eslint-env jest */
import { mount } from 'enzyme'
import React from 'react'
import { IconCaretLeft, IconCaretRight } from 'vtex.styleguide'

import SearchFooter from '../../components/SearchFooter'

describe('<SearchFooter /> component', () => {
  let renderComponent = null
  const defaultProps = {
    recordsFiltered: 20,
    page: 1,
    maxItemsPerPage: 5,
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

  it('should not render an IconCaretLeft if is the first page and render an IconCaretRight', () => {
    const component = renderComponent()
    expect(component.find(IconCaretLeft).exists()).toBe(false)
    expect(component.find(IconCaretRight).exists()).toBe(true)
  })

  it('should render an IconCaretLeft if is the last page and not render an IconCaretRight', () => {
    const component = renderComponent({
      page: 2,
      recordsFiltered: 2,
      maxItemsPerPage: 1,
    })
    expect(component.find(IconCaretLeft).exists()).toBe(true)
    expect(component.find(IconCaretRight).exists()).toBe(false)
  })

  it('should render both IconCaretLeft and IconCaretRight if is neither the first nor the last page', () => {
    const component = renderComponent({
      page: 2,
      recordsFiltered: 3,
      maxItemsPerPage: 1,
    })
    expect(component.find(IconCaretLeft).exists()).toBe(true)
    expect(component.find(IconCaretRight).exists()).toBe(true)
  })
})
