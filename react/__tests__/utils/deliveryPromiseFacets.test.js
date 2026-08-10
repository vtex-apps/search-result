import {
  hasDeliveryPromiseBlock,
  resolveShowDeliveryPromiseFacets,
} from '../../utils/deliveryPromiseFacets'

describe('hasDeliveryPromiseBlock', () => {
  it('is false for an empty or missing registry', () => {
    expect(hasDeliveryPromiseBlock(undefined)).toBe(false)
    expect(hasDeliveryPromiseBlock({})).toBe(false)
  })

  it('is true when any delivery-promise block is registered', () => {
    expect(
      hasDeliveryPromiseBlock({ shopperLocation: { required: false } })
    ).toBe(true)
    expect(
      hasDeliveryPromiseBlock({ shippingMethod: { required: true } })
    ).toBe(true)
    expect(hasDeliveryPromiseBlock({ pickupPoint: { required: false } })).toBe(
      true
    )
  })
})

describe('resolveShowDeliveryPromiseFacets truth table', () => {
  const resolve = args =>
    resolveShowDeliveryPromiseFacets({
      showDeliveryPromiseFacets: undefined,
      showShippingMethodFacet: undefined,
      hasBlock: false,
      ...args,
    })

  it('shows when showDeliveryPromiseFacets is true (regardless of blocks)', () => {
    expect(resolve({ showDeliveryPromiseFacets: true, hasBlock: false })).toBe(
      true
    )
    expect(resolve({ showDeliveryPromiseFacets: true, hasBlock: true })).toBe(
      true
    )
  })

  it('hides when showDeliveryPromiseFacets is false (regardless of blocks)', () => {
    expect(resolve({ showDeliveryPromiseFacets: false, hasBlock: true })).toBe(
      false
    )
    expect(resolve({ showDeliveryPromiseFacets: false, hasBlock: false })).toBe(
      false
    )
  })

  it('falls back to blocks when neither prop is provided', () => {
    expect(resolve({ hasBlock: true })).toBe(true)
    expect(resolve({ hasBlock: false })).toBe(false)
  })

  it('uses the deprecated showShippingMethodFacet when the new prop is unset', () => {
    expect(resolve({ showShippingMethodFacet: true, hasBlock: false })).toBe(
      true
    )
    expect(resolve({ showShippingMethodFacet: false, hasBlock: true })).toBe(
      false
    )
  })

  it('lets showDeliveryPromiseFacets win over the deprecated prop', () => {
    expect(
      resolve({
        showDeliveryPromiseFacets: true,
        showShippingMethodFacet: false,
        hasBlock: false,
      })
    ).toBe(true)
    expect(
      resolve({
        showDeliveryPromiseFacets: false,
        showShippingMethodFacet: true,
        hasBlock: true,
      })
    ).toBe(false)
  })
})
