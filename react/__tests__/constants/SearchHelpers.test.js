/* eslint-env jest */
import { getSpecificationFilterFromLink, getPagesArgs } from '../../constants/SearchHelpers'

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

describe('getPagesArgs', () => {
  it('should stay in the search page', () => {
    const filterSpec = {
      type: 'Brands',
      name: 'Samsung',
      rest: [],
      map: ['ft'],
      pagesPath: 'store/search',
      params: {
        term: 'samsung',
        _rest: '',
      },
    }

    const { page, query: { map, rest } } = getPagesArgs(filterSpec)

    expect(map).toEqual(['ft', 'b'])
    expect(rest).toEqual(['Samsung'])
    expect(page).toEqual('store/search')
  })

  it('should add single category on department page', () => {
    const filterSpec = {
      type: 'Categories',
      name: 'Smartphones',
      path: 'Eletronicos/Smartphones',
      rest: [],
      map: ['c'],
      pagesPath: 'store/department',
      params: {
        department: 'eletronicos',
        _rest: '',
      },
    }

    const { query: { map, rest } } = getPagesArgs(filterSpec)

    expect(map).toEqual(['c', 'c'])
    expect(rest).toEqual(['Smartphones'])
  })

  it('should add single category on search page', () => {
    const filterSpec = {
      type: 'Categories',
      name: 'Smartphones',
      path: 'Eletronicos/Smartphones',
      rest: [],
      map: ['ft'],
      pagesPath: 'store/search',
      params: {
        term: 'samsung',
        _rest: '',
      },
    }

    const { page, query: { map, rest } } = getPagesArgs(filterSpec)

    expect(page).toEqual('store/search')
    expect(map).toEqual(['ft', 'c', 'c'])
    expect(rest).toEqual(['Eletronicos', 'Smartphones'])
  })

  it('should only remove subcategory on category page', () => {
    const filterSpec = {
      type: 'Categories',
      isUnselectLink: true,
      name: 'Acessórios',
      path: 'Eletronicos/Smartphones/Acessorios',
      rest: ['Acessorios'],
      map: ['c', 'c', 'c'],
      pagesPath: 'store/category',
      params: {
        department: 'Eletronicos',
        category: 'Smartphones',
        _rest: '',
      },
    }

    const { query: { map, rest } } = getPagesArgs(filterSpec)

    expect(map).toEqual(['c', 'c'])
    expect(rest).toEqual([])
  })

  it('should remove one sub-subcategory on subcategory page', () => {
    const filterSpec = {
      type: 'Categories',
      isUnselectLink: true,
      name: 'foo',
      path: 'Eletronicos/Smartphones/Acessorios/foo',
      rest: ['Samsung', 'foo'],
      map: ['c', 'b', 'c', 'c', 'c'],
      pagesPath: 'store/subcategory',
      params: {
        department: 'Eletronicos',
        category: 'Smartphones',
        subcategory: 'Acessorios',
        _rest: '',
      },
    }

    const { query: { map, rest } } = getPagesArgs(filterSpec)

    expect(map).toEqual(['c', 'b', 'c', 'c'])
    expect(rest).toEqual(['Samsung'])
  })

  it('should remove brand from filters', () => {
    const filterSpec = {
      type: 'Brands',
      isUnselectLink: true,
      name: 'Samsung',
      rest: ['Samsung'],
      map: ['c', 'c', 'b'],
      pagesPath: 'store/category',
      params: {
        department: 'Eletronicos',
        category: 'Computadores',
        _rest: '',
      },
    }

    const { query: { map, rest } } = getPagesArgs(filterSpec)

    expect(map).toEqual(['c', 'c'])
    expect(rest).toEqual([])
  })

  it('should only add order to query', () => {
    const filterSpec = {
      orderBy: 'OrderByPriceASC',
      rest: ['Smartphones'],
      map: ['c', 'c'],
      params: {
        department: 'Eletronicos',
        _rest: '',
      },
    }

    const { query: { order, map, rest } } = getPagesArgs(filterSpec)

    expect(map).toEqual(filterSpec.map)
    expect(rest).toEqual(filterSpec.rest)
    expect(order).toBe(filterSpec.orderBy)
  })

  it('should remove category from rest', () => {
    const filterSpec = {
      type: 'Categories',
      isUnselectLink: true,
      name: 'Smartphones',
      map: ['c', 'c', 'b'],
      rest: ['Smartphones', 'Google'],
      pagesPath: 'store/department',
      params: {
        department: 'Eletronicos',
        _rest: '',
      },
    }

    const { query: { map, rest } } = getPagesArgs(filterSpec)

    expect(map).toEqual(['c', 'b'])
    expect(rest).toEqual(['Google'])
  })
})
