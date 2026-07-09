import { getProductsPositionOffset } from '../../utils/getProductsPositionOffset'

describe('getProductsPositionOffset', () => {
  const baseParams = {
    maxItemsPerPage: 18,
    productsCount: 18,
  }

  it('returns 0 on the first page', () => {
    expect(
      getProductsPositionOffset({
        ...baseParams,
        from: 0,
        queryFrom: 0,
        urlPage: 1,
      })
    ).toBe(0)
  })

  it('uses queryFrom on direct page load when reducer from is still 0', () => {
    expect(
      getProductsPositionOffset({
        ...baseParams,
        from: 0,
        queryFrom: 18,
        urlPage: 2,
      })
    ).toBe(18)
  })

  it('uses urlPage when queryFrom is unavailable', () => {
    expect(
      getProductsPositionOffset({
        ...baseParams,
        from: 0,
        queryFrom: 0,
        urlPage: 2,
      })
    ).toBe(18)
  })

  it('keeps offset 0 after load more accumulates multiple pages in the DOM', () => {
    expect(
      getProductsPositionOffset({
        ...baseParams,
        productsCount: 36,
        from: 0,
        queryFrom: 0,
        urlPage: 2,
      })
    ).toBe(0)
  })

  it('keeps offset 0 after fetch previous prepends earlier pages', () => {
    expect(
      getProductsPositionOffset({
        ...baseParams,
        productsCount: 36,
        from: 0,
        queryFrom: 18,
        urlPage: 1,
      })
    ).toBe(0)
  })

  it('prefers live reducer from after fetch previous on a deep page', () => {
    expect(
      getProductsPositionOffset({
        ...baseParams,
        productsCount: 36,
        from: 18,
        queryFrom: 36,
        urlPage: 2,
      })
    ).toBe(18)
  })
})
