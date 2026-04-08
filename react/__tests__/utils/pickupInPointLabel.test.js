import {
  getNearestPickup,
  getPickupInPointIdFromQueryMap,
  hasStoredPickupPreferenceForZip,
  isPickupInPointShippingValue,
  readStoredPickupFriendlyName,
  resolvePickupInPointFacetForNavigation,
} from '../../utils/pickupInPointLabel'
import { PICKUP_IN_POINT_STORAGE_KEY } from '../../constants/pickupSearch'

describe('isPickupInPointShippingValue', () => {
  it('matches base and pickup-in-point-{id}', () => {
    expect(isPickupInPointShippingValue('pickup-in-point')).toBe(true)
    expect(isPickupInPointShippingValue('pickup-in-point-abc')).toBe(true)
  })

  it('rejects other values', () => {
    expect(isPickupInPointShippingValue('delivery')).toBe(false)
    expect(isPickupInPointShippingValue('pickup-nearby')).toBe(false)
  })
})

describe('getNearestPickup', () => {
  it('returns undefined for empty list', () => {
    expect(getNearestPickup([])).toBeUndefined()
    expect(getNearestPickup(undefined)).toBeUndefined()
  })

  it('returns pickup with minimum distance', () => {
    const a = { distance: 10, pickupPoint: { id: 'a' } }
    const b = { distance: 3, pickupPoint: { id: 'b' } }

    expect(getNearestPickup([a, b])).toBe(b)
  })
})

describe('getPickupInPointIdFromQueryMap', () => {
  it('returns id when shipping map includes pickup-in-point-{id}', () => {
    expect(
      getPickupInPointIdFromQueryMap(
        'ft/eletronics/pickup-in-point-abc123',
        'ft,c,shipping'
      )
    ).toBe('abc123')
  })

  it('returns undefined when shipping value is generic pickup-in-point', () => {
    expect(
      getPickupInPointIdFromQueryMap('ft/foo/pickup-in-point', 'ft,c,shipping')
    ).toBeUndefined()
  })

  it('returns undefined when query or map is missing', () => {
    expect(getPickupInPointIdFromQueryMap('', 'shipping')).toBeUndefined()
    expect(getPickupInPointIdFromQueryMap('a', '')).toBeUndefined()
  })
})

describe('hasStoredPickupPreferenceForZip', () => {
  const originalGetItem = Storage.prototype.getItem

  afterEach(() => {
    Storage.prototype.getItem = originalGetItem
  })

  it('returns false when nothing stored', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => null)

    expect(hasStoredPickupPreferenceForZip('01310-100')).toBe(false)
  })

  it('returns true when postalCode matches zip', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() =>
      JSON.stringify({
        id: 'p1',
        postalCode: '01310-100',
        friendlyName: 'Loja',
      })
    )

    expect(hasStoredPickupPreferenceForZip('01310100')).toBe(true)
  })

  it('returns false when postalCode does not match', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() =>
      JSON.stringify({
        id: 'p1',
        postalCode: '99999-999',
        friendlyName: 'Loja',
      })
    )

    expect(hasStoredPickupPreferenceForZip('01310-100')).toBe(false)
  })

  it('returns true when legacy payload has no postalCode', () => {
    jest
      .spyOn(Storage.prototype, 'getItem')
      .mockImplementation(() =>
        JSON.stringify({ id: 'p1', friendlyName: 'Loja' })
      )

    expect(hasStoredPickupPreferenceForZip('anything')).toBe(true)
  })
})

describe('readStoredPickupFriendlyName', () => {
  const originalGetItem = Storage.prototype.getItem

  afterEach(() => {
    Storage.prototype.getItem = originalGetItem
  })

  it('returns friendlyName when stored id matches', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      if (key === PICKUP_IN_POINT_STORAGE_KEY) {
        return JSON.stringify({
          id: 'xyz',
          friendlyName: 'Loja Centro',
        })
      }

      return null
    })

    expect(readStoredPickupFriendlyName('xyz')).toBe('Loja Centro')
  })

  it('returns empty string when id does not match', () => {
    jest
      .spyOn(Storage.prototype, 'getItem')
      .mockImplementation(() =>
        JSON.stringify({ id: 'other', friendlyName: 'X' })
      )

    expect(readStoredPickupFriendlyName('xyz')).toBe('')
  })
})

describe('resolvePickupInPointFacetForNavigation', () => {
  const originalGetItem = Storage.prototype.getItem

  afterEach(() => {
    Storage.prototype.getItem = originalGetItem
  })

  const baseFacet = {
    key: 'shipping',
    map: 'shipping',
    name: 'Pickup in point',
    value: 'pickup-in-point',
    selected: false,
    quantity: 1,
  }

  it('returns modal when base pickup-in-point and no id in context or storage', () => {
    expect(
      resolvePickupInPointFacetForNavigation(baseFacet, undefined, {})
    ).toEqual({ modal: true })
  })

  it('uses pickupSuggestion when no context or storage', () => {
    const out = resolvePickupInPointFacetForNavigation(baseFacet, undefined, {
      pickupSuggestion: {
        pickupPoint: { id: 'near1', friendlyName: 'Nearest' },
      },
      zipcode: '01310100',
    })

    expect(out.facet).toMatchObject({
      value: 'pickup-in-point-near1',
      name: 'Nearest',
    })
  })

  it('navigates with pickup-in-point-{id} and name from context', () => {
    const out = resolvePickupInPointFacetForNavigation(baseFacet, {
      pickupPoint: {
        id: 'p1',
        friendlyName: 'Loja A',
        address: {},
      },
    })

    expect(out.modal).toBeUndefined()
    expect(out.facet).toMatchObject({
      value: 'pickup-in-point-p1',
      name: 'Loja A',
      key: 'shipping',
    })
  })

  it('navigates with id from storage when context has no pickup', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      if (key === PICKUP_IN_POINT_STORAGE_KEY) {
        return JSON.stringify({
          id: 'stored-id',
          friendlyName: 'Loja Storage',
        })
      }

      return null
    })

    const out = resolvePickupInPointFacetForNavigation(baseFacet, undefined, {
      zipcode: '01310100',
    })

    expect(out.facet).toMatchObject({
      value: 'pickup-in-point-stored-id',
      name: 'Loja Storage',
    })
  })

  it('ignores storage when postalCode does not match current zip', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() =>
      JSON.stringify({
        id: 'far-id',
        postalCode: '99999-999',
        friendlyName: 'Far',
      })
    )

    const out = resolvePickupInPointFacetForNavigation(baseFacet, undefined, {
      pickupSuggestion: {
        pickupPoint: { id: 'near1', friendlyName: 'Nearest' },
      },
      zipcode: '01310-100',
    })

    expect(out.facet).toMatchObject({
      value: 'pickup-in-point-near1',
      name: 'Nearest',
    })
  })

  it('passes through non-base shipping facets', () => {
    const delivery = {
      key: 'shipping',
      map: 'shipping',
      name: 'Delivery',
      value: 'delivery',
      selected: false,
    }

    expect(resolvePickupInPointFacetForNavigation(delivery, undefined)).toEqual(
      { facet: delivery }
    )
  })
})
