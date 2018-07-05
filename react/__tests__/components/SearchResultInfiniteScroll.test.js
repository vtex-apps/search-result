/* eslint-env jest */
import { mount } from 'enzyme'
import React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { IntlProvider } from 'react-intl'

import SearchResultInfiniteScroll from '../../components/SearchResultInfiniteScroll'

describe('<SearchResultInfiniteScroll /> component', () => {
  let renderComponent = null
  let searchQueryMock = null
  let facetsQueryMock = null
  const productsMock = require('../../__mocks__/products.json')

  beforeEach(() => {
    const messages = require('../../locales/en-US')
    searchQueryMock = {
      loading: false,
      variables: {
        query: 'eletronics',
        map: 'c',
        orderBy: 'OrderByTopSaleDESC',
      },
      products: productsMock,
    }

    facetsQueryMock = {
      loading: false,
    }

    renderComponent = (
      props = {
        page: 1,
        map: 'c',
        rest: '',
        path: 'eletronics',
        maxItemsPerPage: 10,
        searchQuery: searchQueryMock,
        facetsQuery: facetsQueryMock,
        state: {
          loading: false,
        },
      }
    ) =>
      mount(
        <IntlProvider locale="en-US" messages={messages}>
          <SearchResultInfiniteScroll {...props} />
        </IntlProvider>
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
