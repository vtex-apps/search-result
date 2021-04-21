/* eslint-disable jest/no-mocks-import */
/* eslint-env jest */
import React from 'react'
import { render, fireEvent } from '@vtex/test-tools/react'
import { useDevice } from 'vtex.device-detector'
import { setMobileState } from 'vtex.render-runtime'

import OrderBy from '../OrderBy'
import { useRuntime } from '../__mocks__/vtex.render-runtime'

const mockUseRuntime = useRuntime

const mockSetQuery = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()

  mockUseRuntime.mockImplementation(() => ({
    setQuery: mockSetQuery,
  }))

  useDevice.mockImplementation(() => ({
    isMobile: false,
  }))
})

describe('<OrderBy />', () => {
  const renderComponent = (customProps) => (mobile) => {
    setMobileState(mobile)

    const props = {
      orderBy: 'OrderByTopSaleDESC',
      message: 'Sort By',
      ...customProps,
    }

    return render(<OrderBy {...props} />)
  }

  afterEach(() => {
    setMobileState(false)
  })

  it('should shown dropdown box on mobile mode', () => {
    const { container } = renderComponent()(true)

    let dropdownContainer = container.querySelector('.orderByDropdown > .dn')
    const button = container.querySelector('button')

    // Expect Dropdown container be rendered with display none
    expect(dropdownContainer).toBeDefined()
    expect(dropdownContainer).not.toBeNull()

    fireEvent.click(button)
    dropdownContainer = container.querySelector('.orderByDropdown > .dn')

    // Expect Dropdown container be rendered without display none
    expect(dropdownContainer).toBeNull()
  })

  it('should match snapshot in web mod', () => {
    const { asFragment } = renderComponent()(false)

    expect(asFragment()).toMatchSnapshot()
  })

  it('should match snapshot in mobile', () => {
    const { asFragment } = renderComponent()(true)

    expect(asFragment()).toMatchSnapshot()
  })
})
