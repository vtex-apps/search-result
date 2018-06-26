/* eslint-env jest */
import { mount } from 'enzyme'
import React from 'react'
import { MockedProvider } from 'react-apollo/test-utils'
import { IntlProvider } from 'react-intl'

import SearchResult from '../SearchResult'

describe('<SearchResult /> component', () => {
  let wrapper = null

  beforeEach(() => {
    const messages = require('../locales/en-US')
    wrapper = mount(
      <MockedProvider>
        <IntlProvider locale="en-US" messages={messages}>
          <SearchResult params={{ term: 'eletronics' }} query={{ map: 'c' }} />
        </IntlProvider>
      </MockedProvider>
    )
  })

  it('should be rendered', () => {
    expect(wrapper).toBeDefined()
  })
})
