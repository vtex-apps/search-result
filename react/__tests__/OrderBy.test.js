/* eslint-env jest */
import React from 'react'
import { render, fireEvent } from '@vtex/test-tools/react'

import OrderBy from '../OrderBy'
import { setMobileState } from 'vtex.render-runtime'

describe('<OrderBy />', () => {
  const renderComponent = customProps => mobile => {
    setMobileState(mobile)
    const getLinkProps = jest.fn().mockImplementation(pageNumber => {
      return {
        page: `mockedPage${pageNumber}`,
        params: 'mockedParams',
      }
    })

    const props = {
      orderBy: 'OrderByTopSaleDESC',
      getLinkProps,
      ...customProps,
    }

    return { ...render(<OrderBy {...props} />), getLinkProps }
  }

  it('should shown dropdown box on mobile mode', () => {
    const { container } = renderComponent()(true)

    let dropdownContainer = container.querySelector('.dropdownMobile > .dn')
    const button = container.querySelector('button')
    // Expect Dropdown container be redered with display none
    expect(dropdownContainer).toBeDefined()
    expect(dropdownContainer).not.toBeNull()

    fireEvent.click(button)
    dropdownContainer = container.querySelector('.dropdownMobile > .dn')

    // Expect Dropdown container be redered without display none
    expect(dropdownContainer).toBeNull()
  })

  it('should call getLinkProps', () => {
    const { container, getLinkProps } = renderComponent()(true)

    const button = container.querySelector('button')
    fireEvent.click(button)
    // Expect Dropdown container be redered without display none
    expect(getLinkProps).toBeCalled()
  })

  it('should match snapshot in web mod', () => {
    const { asFragment } = renderComponent()(false)

    expect(asFragment()).toMatchSnapshot()
  })

  it('should match snapshot in mobile', () => {
    const { asFragment } = renderComponent()(true)

    expect(asFragment()).toMatchSnapshot()
  })

  afterEach(() => {
    setMobileState(false)
  })
})
