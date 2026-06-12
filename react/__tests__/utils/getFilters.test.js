import React from 'react'
import { IntlProvider } from 'react-intl'
import { renderHook } from '@testing-library/react-hooks'

import getFilters, {
  getDeliveryGroupTitle,
  shouldHideDeliveryGroupHeader,
  SHIPPING_TITLE,
  DELIVERY_OPTION_TITLE,
  DYNAMIC_ESTIMATE_TITLE,
} from '../../utils/getFilters'

describe('getDeliveryGroupTitle', () => {
  it('maps the shipping group to the shipping title id', () => {
    expect(getDeliveryGroupTitle('shipping')).toBe(SHIPPING_TITLE)
  })

  it('maps the delivery-options group to the Delivery Option title id', () => {
    expect(getDeliveryGroupTitle('delivery-options')).toBe(
      DELIVERY_OPTION_TITLE
    )
  })

  it('maps the dynamic-estimate group to the Estimate title id (used on mobile)', () => {
    expect(getDeliveryGroupTitle('dynamic-estimate')).toBe(
      DYNAMIC_ESTIMATE_TITLE
    )
  })

  it('falls back to the raw group name for unknown groups (never "Default Title")', () => {
    expect(getDeliveryGroupTitle('delivery-window')).toBe('delivery-window')
    expect(getDeliveryGroupTitle('delivery-window')).not.toBe('Default Title')
  })
})

describe('shouldHideDeliveryGroupHeader', () => {
  it('flags only the dynamic-estimate group as headerless (hidden on desktop)', () => {
    expect(shouldHideDeliveryGroupHeader('dynamic-estimate')).toBe(true)
    expect(shouldHideDeliveryGroupHeader('delivery-options')).toBe(false)
    expect(shouldHideDeliveryGroupHeader('shipping')).toBe(false)
    expect(shouldHideDeliveryGroupHeader('delivery-window')).toBe(false)
  })
})

describe('getFilters delivery group titles', () => {
  const wrapper = ({ children }) => (
    <IntlProvider locale="en" messages={{}} onError={() => {}}>
      {children}
    </IntlProvider>
  )

  const renderGetFilters = args =>
    renderHook(() => getFilters(args), { wrapper }).result.current

  const makeGroup = name => ({
    name,
    type: 'DELIVERY',
    quantity: 1,
    facets: [{ key: name, name: 'option', value: 'option', map: name }],
  })

  it('flags dynamic-estimate as headerless with the Estimate title and titles delivery-options even when no shipping group is present', () => {
    const filters = renderGetFilters({
      deliveries: [
        makeGroup('delivery-options'),
        makeGroup('dynamic-estimate'),
      ],
    })

    const estimate = filters.find(filter => filter.name === 'dynamic-estimate')
    const deliveryOption = filters.find(
      filter => filter.name === 'delivery-options'
    )

    expect(estimate.hideHeader).toBe(true)
    expect(estimate.title).toBe(DYNAMIC_ESTIMATE_TITLE)
    expect(deliveryOption.hideHeader).toBe(false)
    expect(deliveryOption.title).toBe(DELIVERY_OPTION_TITLE)
    expect(deliveryOption.title).not.toBe('Default Title')
  })

  it('orders the dynamic-estimate group first over all other filters', () => {
    const filters = renderGetFilters({
      deliveries: [
        makeGroup('delivery-options'),
        makeGroup('dynamic-estimate'),
      ],
      brands: [{ name: 'Samsung', value: 'samsung', selected: false }],
      brandsQuantity: 1,
      specificationFilters: [
        {
          name: 'Color',
          quantity: 1,
          facets: [{ key: 'color', name: 'Blue', value: 'blue' }],
        },
      ],
    })

    expect(filters[0].name).toBe('dynamic-estimate')
  })

  it('titles the shipping group with the shipping title id and keeps its header', () => {
    const filters = renderGetFilters({
      deliveries: [
        {
          name: 'shipping',
          type: 'DELIVERY',
          quantity: 1,
          facets: [
            {
              key: 'shipping',
              name: 'delivery',
              value: 'delivery',
              map: 'shipping',
            },
          ],
        },
      ],
      showShippingMethodFacet: true,
    })

    const shipping = filters.find(filter => filter.name === 'shipping')

    expect(shipping.title).toBe(SHIPPING_TITLE)
    expect(shipping.hideHeader).toBe(false)
  })

  it('falls back to the raw name for an unknown delivery group and keeps its header', () => {
    const filters = renderGetFilters({
      deliveries: [makeGroup('delivery-window')],
    })

    const unknown = filters.find(filter => filter.name === 'delivery-window')

    expect(unknown.title).toBe('delivery-window')
    expect(unknown.title).not.toBe('Default Title')
    expect(unknown.hideHeader).toBe(false)
  })
})
