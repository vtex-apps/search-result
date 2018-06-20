/* eslint-env jest */
import React from 'react'
import { MockedProvider } from 'react-apollo/test-utils'
import { IntlProvider } from 'react-intl'
import { render } from 'react-testing-library'

import SearchResultInfiniteScroll from '../../components/SearchResultInfiniteScroll'
import searchQuery from '../../graphql/searchQuery.gql'

describe('<SearchResultInfiniteScroll /> component', () => {
  let renderComponent = null
  let searchQueryMock = null

  beforeEach(() => {
    const messages = require('../../locales/en-US')
    searchQueryMock = {
      request: {
        query: searchQuery,
        variables: {
          from: 0,
          to: 9,
          map: 'c',
          query: 'eletronics',
        },
      },
    }

    renderComponent = (props = { page: 1, map: 'c', path: 'eletronics' }) =>
      render(
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
})
