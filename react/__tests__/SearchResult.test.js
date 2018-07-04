/* eslint-env jest */
import { mount } from 'enzyme'
import React from 'react'
import { IntlProvider } from 'react-intl'

import SearchResult from '../SearchResult'

describe('<SearchResult /> component', () => {
  let wrapper = null
  let searchQueryMock = null
  let facetsQueryMock = null

  beforeEach(() => {
    const messages = require('../locales/en-US')
    searchQueryMock = {
      loading: false,
      variables: {
        query: 'eletronics',
        map: 'c',
        orderBy: 'OrderByTopSaleDESC',
      },
      products: [],
    }

    facetsQueryMock = {
      loading: false,
    }

    wrapper = mount(
      <IntlProvider locale="en-US" messages={messages}>
        <SearchResult
          state={{
            setContextVariables: jest.fn(),
          }}
          params={{ term: 'eletronics' }}
          map="c"
          path="eletronics/s"
          page={1}
          searchQuery={searchQueryMock}
          facetsQuery={facetsQueryMock}
        />
      </IntlProvider>
    )
  })

  it('should be rendered', () => {
    expect(wrapper).toBeDefined()
  })
})
