/* eslint-env jest */
import React from 'react'
import { IntlProvider } from 'react-intl'
import { render } from 'react-testing-library'
import { MockedProvider } from 'react-apollo/test-utils'

import SearchResult from '../SearchResult'

describe('<SearchResult /> component', () => {
  let wrapper = null

  beforeEach(() => {
    const messages = require('../locales/en-US')
    wrapper = render(
      <MockedProvider >
        <IntlProvider locale="en-US" messages={messages}>
          <SearchResult
            params={{ term: 'eletronics' }}
            query={{ map: 'c' }}
          />
        </IntlProvider>
      </MockedProvider>
    )
  })

  it('should be rendered', () => {
    expect(wrapper).toBeDefined()
  })

  it('should match snapshot', () => {
    expect(wrapper.container).toMatchSnapshot()
  })
})
