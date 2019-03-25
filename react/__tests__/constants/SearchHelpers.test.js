/* eslint-env jest */
import {
  getSpecificationFilterFromLink,
  getPagesArgs,
} from '../../constants/SearchHelpers'
import {
  CATEGORIES_TYPE,
  BRANDS_TYPE,
  PRICE_RANGES_TYPE,
  SPECIFICATION_FILTERS_TYPE,
} from '../../FilterNavigator'

describe('getSpecificationFilterFromLink', () => {
  it('should return the only specification in link', () => {
    const link =
      '/eletronicos/smartphones/Android 7.0?map=c,c,specificationFilter_20'
    const slug = 'Android 7.0'

    const filterMap = getSpecificationFilterFromLink(link, slug)

    expect(filterMap).toBe('specificationFilter_20')
  })

  it('should return the first non-equal specification', () => {
    const link =
      '/eletronicos/smartphones/Android 7.0/3 GB?map=c,c,specificationFilter_20,specificationFilter_21'
    const slug = '3 GB'

    const filterMap = getSpecificationFilterFromLink(link, slug)

    expect(filterMap).toBe('specificationFilter_21')
  })

  it('should return the duplicated specification', () => {
    const link =
      '/eletronicos/smartphones/Android 7.0/Android 7.1?map=c,c,specificationFilter_20,specificationFilter_20'
    const slug = 'Android 7.1'

    const filterMap = getSpecificationFilterFromLink(link, slug)

    expect(filterMap).toBe('specificationFilter_20')
  })

  it('should ignore the order of the elements', () => {
    const link =
      '/eletronicos/smartphones/3 GB/Android 7.1?map=c,c,specificationFilter_20,specificationFilter_21,specificationFilter_22'
    const slug = 'Android 7.1'

    const filterMap = getSpecificationFilterFromLink(link, slug)

    expect(filterMap).toBe('specificationFilter_21')
  })

  it("should bail out if can't match the params", () => {
    const link =
      '/eletronics/smartphones/android 7.1?map=c,c,specificationFilter_20'
    const slug = 'Android 7.1'

    const filterMap = getSpecificationFilterFromLink(link, slug)

    expect(filterMap).toBe(undefined)
  })
})

describe('getPagesArgs', () => {
  const DEPARTMENT_PAGE = 'store.search#department'
  const CATEGORY_PAGE = 'store.search#category'
  const SEARCH_PAGE = 'store.search'

  it('should stay in the search page', () => {
    const filterSpec = {
      type: BRANDS_TYPE,
      name: 'Samsung',
      slug: 'Samsung',
      pagesPath: SEARCH_PAGE,
      query: {
        rest: [],
        map: ['ft'],
      },
      params: {
        term: 'samsung',
        _rest: '',
      },
    }

    const {
      page,
      query: { map, rest },
    } = getPagesArgs(filterSpec)

    expect(map).toEqual(['ft', 'b'])
    expect(rest).toEqual(['Samsung'])
    expect(page).toEqual(SEARCH_PAGE)
  })

  it('should add single category on department page', () => {
    const filterSpec = {
      type: CATEGORIES_TYPE,
      name: 'Smartphones',
      slug: 'Smartphones',
      path: 'Eletronicos/Smartphones',
      pagesPath: DEPARTMENT_PAGE,
      query: {
        rest: [],
        map: ['c'],
      },
      params: {
        department: 'eletronicos',
        _rest: '',
      },
    }

    const {
      query: { map, rest },
    } = getPagesArgs(filterSpec)

    expect(map).toEqual(['c', 'c'])
    expect(rest).toEqual(['Smartphones'])
  })

  it('should add subcategory on department page', () => {
    const filterSpec = {
      type: CATEGORIES_TYPE,
      name: 'Acessórios',
      slug: 'Acessorios',
      path: 'Eletronicos/Smartphones/Acessorios',
      pagesPath: DEPARTMENT_PAGE,
      query: {
        map: ['c', 'c'],
        rest: ['Smartphones'],
      },
      params: {
        department: 'Eletronicos',
      },
    }

    const {
      query: { map, rest },
    } = getPagesArgs(filterSpec)

    expect(map).toEqual(['c', 'c', 'c'])
    expect(rest).toEqual(['Smartphones', 'Acessorios'])
  })

  it('should add single category on search page', () => {
    const filterSpec = {
      type: CATEGORIES_TYPE,
      name: 'Smartphones',
      slug: 'Smartphones',
      path: 'Eletronicos/Smartphones',
      pagesPath: SEARCH_PAGE,
      query: {
        rest: ['Eletronicos'],
        map: ['ft', 'c'],
      },
      params: {
        term: 'samsung',
        _rest: '',
      },
    }

    const {
      page,
      query: { map, rest },
    } = getPagesArgs(filterSpec)

    expect(page).toEqual(SEARCH_PAGE)
    expect(map).toEqual(['ft', 'c', 'c'])
    expect(rest).toEqual(['Eletronicos', 'Smartphones'])
  })

  it('should only remove subcategory on category page', () => {
    const filterSpec = {
      type: CATEGORIES_TYPE,
      isUnselectLink: true,
      name: 'Acessórios',
      slug: 'Acessorios',
      path: 'Eletronicos/Smartphones/Acessorios',
      pagesPath: CATEGORY_PAGE,
      query: {
        rest: ['Acessorios'],
        map: ['c', 'c', 'c'],
      },
      params: {
        department: 'Eletronicos',
        category: 'Smartphones',
        _rest: '',
      },
    }

    const {
      query: { map, rest },
    } = getPagesArgs(filterSpec)

    expect(map).toEqual(['c', 'c'])
    expect(rest).toEqual([])
  })

  it('should remove category from rest', () => {
    const filterSpec = {
      type: CATEGORIES_TYPE,
      isUnselectLink: true,
      name: 'Smartphones',
      slug: 'Smartphones',
      path: 'Eletronicos/Smartphones',
      pagesPath: DEPARTMENT_PAGE,
      query: {
        map: ['c', 'c', 'b'],
        rest: ['Smartphones', 'Google'],
      },
      params: {
        department: 'Eletronicos',
        _rest: '',
      },
    }

    const {
      query: { map, rest },
    } = getPagesArgs(filterSpec)

    expect(map).toEqual(['c', 'b'])
    expect(rest).toEqual(['Google'])
  })

  it('should remove brand from filters', () => {
    const filterSpec = {
      type: BRANDS_TYPE,
      isUnselectLink: true,
      name: 'Samsung',
      slug: 'Samsung',
      pagesPath: CATEGORY_PAGE,
      query: {
        rest: ['Samsung'],
        map: ['c', 'c', 'b'],
      },
      params: {
        department: 'Eletronicos',
        category: 'Computadores',
        _rest: '',
      },
    }

    const {
      query: { map, rest },
    } = getPagesArgs(filterSpec)

    expect(map).toEqual(['c', 'c'])
    expect(rest).toEqual([])
  })

  it('should only add order to query', () => {
    const filterSpec = {
      query: {
        rest: ['Smartphones'],
        map: ['c', 'c'],
        order: 'OrderByPriceASC',
      },
      params: {
        department: 'Eletronicos',
        _rest: '',
      },
    }

    const {
      query: { order, map, rest },
    } = getPagesArgs(filterSpec)

    expect(map).toEqual(['c', 'c'])
    expect(rest).toEqual(['Smartphones'])
    expect(order).toBe('OrderByPriceASC')
  })

  it('should return the priceRange query parameter', () => {
    const filterSpec = {
      type: PRICE_RANGES_TYPE,
      slug: 'de-1000-a-1999,99',
      pagesPath: DEPARTMENT_PAGE,
      query: {
        rest: [],
        map: ['c'],
      },
      params: {
        department: 'Eletronicos',
      },
    }

    const {
      query: { priceRange },
    } = getPagesArgs(filterSpec)

    expect(priceRange).toBeDefined()
  })

  it('should update priceRange filter accordingly', () => {
    const filterSpec = {
      type: PRICE_RANGES_TYPE,
      slug: '1000 TO 1999,99',
      pagesPath: DEPARTMENT_PAGE,
      query: {
        rest: [],
        map: ['c'],
      },
      params: {
        department: 'Eletronicos',
      },
    }

    const {
      query: { priceRange },
    } = getPagesArgs(filterSpec)

    expect(priceRange).toBe('1000 TO 1999,99')
  })

  it('should remove correct specification filter map', () => {
    const filterSpec = {
      type: SPECIFICATION_FILTERS_TYPE,
      isUnselectLink: true,
      name: 'Branco',
      slug: 'Branco',
      link:
        '/eletrodomesticos/Geladeira---Refrigerador/Geladeira---Refrigerador/Branco?map=c,c,c,specificationFilter_14',
      pagesPath: 'store.search#subcategory',
      query: {
        rest: ['Outra categoria', 'Branco', '110V'],
        map: [
          'c',
          'c',
          'c',
          'c',
          'specificationFilter_14',
          'specificationFilter_692',
        ],
      },
      params: {
        department: 'eletrodomesticos',
        category: 'geladeiras 1',
        subcategory: 'geladeiras 2',
      },
    }

    const {
      query: { map, rest },
    } = getPagesArgs(filterSpec)

    expect(map).toEqual(['c', 'c', 'c', 'c', 'specificationFilter_692'])
    expect(rest).toEqual(['Outra categoria', '110V'])
  })
})
