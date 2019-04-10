/* eslint-env jest */
import { render, fireEvent } from '@vtex/test-tools/react'
import React from 'react'

import SearchFooter from '../components/SearchFooter'

describe('<SearchFooter /> component', () => {
  const getLinkProps = jest.fn().mockImplementation(pageNumber => {
    return {
      page: `mockedPage${pageNumber}`,
      params: 'mockedParams',
    }
  })
  const renderComponent = customProps => {
    const props = {
      recordsFiltered: 20,
      page: 1,
      maxItemsPerPage: 5,
      runtime: { navigate: () => {} },
      getLinkProps,
      ...customProps,
    }
    return { ...render(<SearchFooter {...props} />), getLinkProps }
  }

  it('should be rendered', () => {
    const { asFragment } = renderComponent()
    expect(asFragment()).toBeDefined()
  })

  it('should return link', () => {
    const { getByTestId, getLinkProps } = renderComponent()
    const mainDiv = getByTestId('page-button')

    fireEvent.click(mainDiv)

    // Expect getLinkProps has been called
    expect(getLinkProps).toBeCalledTimes(1)
  })

  it('should match snapshot', () => {
    const { asFragment } = renderComponent()
    expect(asFragment()).toMatchSnapshot()
  })
})
