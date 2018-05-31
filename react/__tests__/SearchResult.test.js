import React from 'react'
import SearchResult from '../SearchResult'

import products from '../__mocks__/products.json'
import { mountWithIntl, loadTranslation } from 'enzyme-react-intl'

// import { getIntlContextInfo } from '../utils/intlHelpers'

describe('<SearchResult /> component', () => {
  function renderComponent(props = {}) {
    // const { context, childContextTypes, locale } = getIntlContextInfo()

    // loadTranslation(`../locales/${locale}.json`)

    const component = mountWithIntl(
      <SearchResult products={products} {...props} />,
      {
        context,
        // childContextTypes,
      },
    )

    return { component }
  }

  /* eslint-disable */
  it('should render the correct component', () => {
    const { component } = renderComponent()

    expect(component).toBeTruthy()
  })
})
