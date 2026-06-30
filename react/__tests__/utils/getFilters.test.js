import React from 'react'
import { IntlProvider } from 'react-intl'
import { renderHook } from '@testing-library/react-hooks'

import getFilters, {
  getDeliveryGroupTitle,
  shouldHideDeliveryGroupHeader,
  filterHiddenDeliveryGroups,
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

  it('includes the dynamic-estimate group in filters without reordering it', () => {
    // getFilters no longer hoists dynamic-estimate to position 0;
    // the FilterNavigator renders it after SelectedFilters ("Filtrado Por").
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

    expect(filters.some(f => f.name === 'dynamic-estimate')).toBe(true)
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

describe('filterHiddenDeliveryGroups', () => {
  const groups = [
    { name: 'shipping', facets: [] },
    { name: 'dynamic-estimate', facets: [] },
    { name: 'delivery-options', facets: [] },
  ]

  it('returns the input when hiddenFacets has no delivery-promise setting', () => {
    expect(filterHiddenDeliveryGroups(groups, {})).toEqual(groups)
    expect(filterHiddenDeliveryGroups(groups, undefined)).toEqual(groups)
  })

  it('returns an empty array when delivery-promise.hideAll is true', () => {
    expect(
      filterHiddenDeliveryGroups(groups, {
        'delivery-promise': { hideAll: true },
      })
    ).toEqual([])
  })

  it('drops only the groups whose name matches hiddenGroups', () => {
    const filtered = filterHiddenDeliveryGroups(groups, {
      'delivery-promise': {
        hiddenGroups: [{ name: 'dynamic-estimate' }, { name: 'shipping' }],
      },
    })

    expect(filtered).toEqual([{ name: 'delivery-options', facets: [] }])
  })

  it('handles empty / missing inputs without throwing', () => {
    expect(filterHiddenDeliveryGroups(undefined, undefined)).toEqual([])
    expect(
      filterHiddenDeliveryGroups([], { 'delivery-promise': { hideAll: true } })
    ).toEqual([])
  })
})

describe('getFilters hiddenFacets delivery-promise', () => {
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

  it("hides the dynamic-estimate group when listed in hiddenFacets['delivery-promise'].hiddenGroups", () => {
    const filters = renderGetFilters({
      deliveries: [
        makeGroup('delivery-options'),
        makeGroup('dynamic-estimate'),
      ],
      hiddenFacets: {
        'delivery-promise': { hiddenGroups: [{ name: 'dynamic-estimate' }] },
      },
    })

    expect(filters.find(f => f.name === 'dynamic-estimate')).toBeUndefined()
    expect(filters.find(f => f.name === 'delivery-options')).toBeDefined()
  })

  it("hides every delivery group when hiddenFacets['delivery-promise'].hideAll is true", () => {
    const filters = renderGetFilters({
      deliveries: [
        makeGroup('shipping'),
        makeGroup('delivery-options'),
        makeGroup('dynamic-estimate'),
      ],
      showShippingMethodFacet: true,
      hiddenFacets: { 'delivery-promise': { hideAll: true } },
    })

    expect(filters.some(f => f.type === 'DELIVERY')).toBe(false)
  })

  it('hides shipping via hiddenFacets even when showShippingMethodFacet is true', () => {
    const filters = renderGetFilters({
      deliveries: [makeGroup('shipping'), makeGroup('delivery-options')],
      showShippingMethodFacet: true,
      hiddenFacets: {
        'delivery-promise': { hiddenGroups: [{ name: 'shipping' }] },
      },
    })

    expect(filters.find(f => f.name === 'shipping')).toBeUndefined()
    expect(filters.find(f => f.name === 'delivery-options')).toBeDefined()
  })

  it("keeps the existing showShippingMethodFacet gate when hiddenFacets['delivery-promise'] is absent", () => {
    const filters = renderGetFilters({
      deliveries: [makeGroup('shipping'), makeGroup('dynamic-estimate')],
      showShippingMethodFacet: false,
    })

    expect(filters.find(f => f.name === 'shipping')).toBeUndefined()
    expect(filters.find(f => f.name === 'dynamic-estimate')).toBeDefined()
  })
})
