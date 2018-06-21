/* eslint-env jest */
import { mount } from 'enzyme'
import React from 'react'
import { MockedProvider } from 'react-apollo/test-utils'
import InfiniteScroll from 'react-infinite-scroll-component'
import { IntlProvider } from 'react-intl'

import SearchResultInfiniteScroll from '../../components/SearchResultInfiniteScroll'
import searchQuery from '../../graphql/searchQuery.gql'

describe('<SearchResultInfiniteScroll /> component', () => {
  let renderComponent = null
  let searchQueryMock = null
  const productsMock = require('../../__mocks__/products.json')

  beforeEach(() => {
    const messages = require('../../locales/en-US')
    searchQueryMock = {
      request: {
        query: searchQuery,
      },
      result: { data: productsMock },
    }

    renderComponent = (
      props = { page: 1, map: 'c', path: 'eletronics', maxItemsPerPage: 10 }
    ) =>
      mount(
        <MockedProvider mocks={[searchQueryMock]}>
          <IntlProvider locale="en-US" messages={messages}>
            <SearchResultInfiniteScroll {...props} />
          </IntlProvider>
        </MockedProvider>
      )
  })

  it('should be rendered', () => {
    expect(renderComponent()).toBeDefined()
  })

  it('should use the InfiniteScroll component', () => {
    const component = renderComponent()
    expect(component.find(InfiniteScroll).exists()).toBe(true)
  })
})
