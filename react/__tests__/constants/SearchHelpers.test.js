/* eslint-env jest */
import { getSpecificationFilterFromLink } from '../../constants/SearchHelpers'

describe('getSpecificationFilterFromLink', () => {
  it('should return the only specification in link', () => {
    const link = '/eletronicos/smartphones/Android 7.0?map=c,c,specificationFilter_20'
    const map = ['c', 'c']

    const filterMap = getSpecificationFilterFromLink(link, map)

    expect(filterMap).toBe('specificationFilter_20')
  })

  it('should return the first non-equal specification', () => {
    const link =
      '/eletronicos/smartphones/Android 7.0/3 GB?map=c,c,specificationFilter_20,specificationFilter_21'
    const map = ['c', 'c', 'specificationFilter_20']

    const filterMap = getSpecificationFilterFromLink(link, map)

    expect(filterMap).toBe('specificationFilter_21')
  })

  it('should return the duplicated specification', () => {
    const link =
      '/eletronicos/smartphones/Android 7.0/Android 7.1?map=c,c,specificationFilter_20,specificationFilter_20'
    const map = ['c', 'c', 'specificationFilter_20']

    const filterMap = getSpecificationFilterFromLink(link, map)

    expect(filterMap).toBe('specificationFilter_20')
  })

  it('should ignore the order of the elements', () => {
    const link =
      '/eletronicos/smartphones/3 GB/Android 7.1?map=c,c,specificationFilter_20,specificationFilter_21,specificationFilter_22'
    const map = ['c', 'c', 'specificationFilter_20', 'specificationFilter_22']

    const filterMap = getSpecificationFilterFromLink(link, map)

    expect(filterMap).toBe('specificationFilter_21')
  })

  it('should bail out if can\'t match the params', () => {
    const link = '/eletronics/smartphones/android 7.1?map=c,c,specificationFilter_20'
    const map = ['c', 'c', 'specificationFilter_21']

    const filterMap = getSpecificationFilterFromLink(link, map)

    expect(filterMap).toBe('specificationFilter_20')
  })
})
