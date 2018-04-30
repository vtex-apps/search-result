import React from 'react'
import Gallery from '../Gallery'

import { sortProducts } from '../utils/sort'
import products from '../resources/products.json'
import { mountWithIntl, loadTranslation } from 'enzyme-react-intl'

import { getIntlContextInfo } from '../utils/intlHelpers'

describe('<Gallery /> component', () => {
  function getPrice(item) {
    return item.items[0].sellers[0].commertialOffer.Price
  }

  function renderComponent(props = {}) {
    const { context, childContextTypes, locale } = getIntlContextInfo()

    loadTranslation(`../locales/${locale}.json`)

    const component = mountWithIntl(
      <Gallery products={products} {...props} />,
      {
        context,
        childContextTypes,
      },
    )

    return { component }
  }

  /* eslint-disable */
  it('should render the correct component', () => {
    const { component } = renderComponent()

    expect(component).toBeTruthy()
  })

  it('should order products correctly by name', () => {
    const sortingOptions = ['sortBy.nameAZ', 'sortBy.nameZA']

    let list = [...products]

    expect(list[0].productName).toBe(products[0].productName)

    list = sortProducts(list, sortingOptions[0])

    expect(list[0].productName).toBe('Google Pixel - 2 XL')

    list = sortProducts(list, sortingOptions[1])

    expect(list[0].productName).toBe('TV Sony - 4K 3D')
  })

  it('should order products correctly by price', () => {
    const sortingOptions = ['sortBy.higherPrice', 'sortBy.lowerPrice']

    let list = [...products]

    expect(getPrice(list[0])).toBe(getPrice(products[0]))

    list = sortProducts(list, sortingOptions[0])

    expect(getPrice(list[0])).toBe(220000)

    list = sortProducts(list, sortingOptions[1])

    expect(getPrice(list[0])).toBe(936)
  })
})
