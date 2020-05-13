/* eslint-env jest */
import { render, fireEvent } from '@vtex/test-tools/react'
import React from 'react'

import SearchFooter from '../components/SearchFooter'

describe('<SearchFooter /> component', () => {
  const mockedGetLinkProps = jest.fn().mockImplementation(pageNumber => {
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
      getLinkProps: mockedGetLinkProps,
      ...customProps,
    }
    return {
      ...render(<SearchFooter {...props} />),
      getLinkProps: mockedGetLinkProps,
    }
  }

  it('should be rendered', () => {
    const { asFragment } = renderComponent()
    expect(asFragment()).toBeDefined()
  })

  it('should return link', () => {
    const { getAllByTestId, getLinkProps } = renderComponent()
    const [firstLink] = getAllByTestId('page-button')

    fireEvent.click(firstLink)

    // Expect getLinkProps has been called
    expect(getLinkProps).toBeCalledTimes(1)
  })

  it('should match snapshot', () => {
    const { asFragment } = renderComponent()
    expect(asFragment()).toMatchSnapshot()
  })
})
