import { repeat, findLastIndex } from 'ramda'

import { SORT_OPTIONS } from '../components/OrderBy'
import {
  CATEGORIES_TYPE,
  BRANDS_TYPE,
  PRICE_RANGES_TYPE,
  SPECIFICATION_FILTERS_TYPE,
} from '../components/FiltersContainer'

function stripPath(pathName) {
  return pathName
    .replace(/^\//i, '')
    .replace(/\/s$/i, '')
    .replace(/\/d$/i, '')
    .replace(/\/b$/i, '')
}

/**
 * Returns the parameter name to be used in the map
 */
export function getSpecificationFilterFromLink(link, map) {
  const [_, linkQueryParams] = link.split('?') // eslint-disable-line no-unused-vars

  const { map: linkMap } = linkQueryParams.split('&').reduce((acc, param) => {
    const [name, values] = param.split('=')

    return {
      ...acc,
      [name]: values.split(','),
    }
  }, {})

  const filterMapParams = (currentMap, currentLinkMap, index = 0) => {
    if (currentMap.length === 0 || index >= currentLinkMap.length) {
      return currentLinkMap
    }

    if (currentMap[0] !== currentLinkMap[index]) {
      return filterMapParams(currentMap, currentLinkMap, index + 1)
    }

    return filterMapParams(
      currentMap.slice(1, currentMap.length),
      currentLinkMap
        .slice(0, index)
        .concat(currentLinkMap.slice(index + 1, currentLinkMap.length)),
      index
    )
  }

  const filteredLinks = filterMapParams(map, linkMap)

  const [specificationFilterMap] = filteredLinks

  return specificationFilterMap
}

export function getMapByType(type) {
  switch (type) {
    case PRICE_RANGES_TYPE:
      return 'priceFrom'
    case CATEGORIES_TYPE:
      return 'c'
    case BRANDS_TYPE:
      return 'b'
  }
}

/**
 * Returns an object mapped by restValue and your mapValue.
 * E.g.: rest='smartphones,lg' map='c,b' => { smartphones : 'c', lg: 'b' }
 */
function restMapped(rest, map) {
  const restValues = (rest && rest.split(',')) || []
  const mapValues = (map && map.split(',')) || []
  const mapValuesSliced = mapValues.slice(restValues.length * -1)
  return restValues.reduce((acc, value, index) => {
    return { ...acc, [value.toUpperCase()]: mapValuesSliced[index] }
  }, {})
}

/**
 * Returns the last slug of link.
 * E.g.: 'smartphones/Android 7?map=c,specificationFilter_30' => Android 7
 */
function getSlugFromLink(link) {
  if (!link) return ''

  const qIndex = link.indexOf('?')

  const url = link.substr(0, qIndex !== -1 ? qIndex : link.length)
  return stripPath(url).split('/').pop()
}

function removeFilter(map, rest, { type, slug, pagesPath }) {
  let skip = 0

  if (pagesPath === 'store/department') {
    skip = 1
  } else if (pagesPath === 'store/category') {
    skip = 2
  } else if (pagesPath === 'store/subcategory') {
    skip = 3
  }

  const mapSymbol = getMapByType(CATEGORIES_TYPE)

  if (type !== CATEGORIES_TYPE) {
    const index = rest.findIndex(
      item => slug.toLowerCase() === item.toLowerCase()
    )

    if (index !== -1) {
      let mapIndex = -1
      let count = -1

      for (const symbol of map) {
        mapIndex++

        if (symbol === mapSymbol && skip > 0) {
          skip--
        } else if (count === index) {
          break
        } else {
          count++
        }
      }

      return {
        rest: rest.filter((_, i) => i !== index),
        map: map.filter((_, i) => i !== mapIndex),
      }
    }

    return { map, rest }
  }

  let restIndex = -1

  for (const symbol of map) {
    if (symbol === mapSymbol && skip > 0) {
      skip--
    } else {
      restIndex++
    }
  }

  if (restIndex !== -1) {
    const lastMapSymbolIndex = findLastIndex(m => m === mapSymbol)(map)
    return {
      map: map.filter((_, i) => i !== lastMapSymbolIndex),
      rest: rest.filter((_, i) => i !== restIndex),
    }
  }

  return { map, rest }
}

function addFilter(map, rest, { path, type, link, pagesPath, slug }) {
  const mapSymbol = type === SPECIFICATION_FILTERS_TYPE
    ? getSpecificationFilterFromLink(link, map)
    : getMapByType(type)

  if (type !== CATEGORIES_TYPE) {
    return {
      rest: [...rest, slug],
      map: [...map, mapSymbol],
    }
  }

  const args = path.split('/')

  let categoryIndex = 0

  if (pagesPath === 'store/department') {
    categoryIndex = 1
  } else if (pagesPath === 'store/category') {
    categoryIndex = 2
  } else if (pagesPath === 'store/subcategory') {
    // For a subcategory route, we need to support any arbitrary
    // number of subcategories, so the route will look like:
    //
    //   vtexstore.com/eletronics/pc/motherboards/?map=c,c,c,c&rest=ATX
    //
    // In this case, if we have another subcategory filter, it will
    // have a path like "eletronics/pc/motherboards/atx/foo"
    // and we need to only append the "foo" in our map and
    // rest array, which is in the 5th position (4th index)
    categoryIndex = map.filter(m => m === mapSymbol).length
  }

  const count = Math.max(args.length - categoryIndex, 0)

  return {
    map: [...map, ...repeat(mapSymbol, count)],
    rest: rest.concat(args.splice(categoryIndex)),
  }
}

/**
 * Returns the props to Link component.
 */
export function getPagesArgs({
  type,
  rest = [],
  map = [],
  params,
  orderBy,
  path,
  name,
  link,
  pageNumber = 1,
  pagesPath,
  isUnselectLink,
}) {
  let mapValues = map
  let restValues = rest

  // We won't have the type if only the orderBy has been changed
  if (type) {
    const filters = isUnselectLink
      ? removeFilter(map, rest, { type, slug: name, pagesPath })
      : addFilter(map, rest, { type, link, path, slug: name, pagesPath })

    mapValues = filters.map
    restValues = filters.rest
  }

  return {
    page: pagesPath,
    params,
    orderBy,
    query: {
      map: mapValues,
      page: pageNumber !== 1 ? pageNumber : undefined,
      order: orderBy !== SORT_OPTIONS[0].value ? orderBy : undefined,
      rest: restValues,
    },
  }
}

export function getBaseMap(map, rest) {
  const mapArray = map.split(',')
  const restArray = rest.split(',').filter(s => s.length > 0)

  return mapArray.splice(0, Math.max(mapArray.length - restArray.length, 0)).join(',')
}

export function mountOptions(options, type, map, rest) {
  const restMap = restMapped(rest, map)

  return options.reduce((acc, opt) => {
    const slug = getSlugFromLink(opt.Link)
    const optMap = type === SPECIFICATION_FILTERS_TYPE
      ? getSpecificationFilterFromLink(opt.Link, map.split(','))
      : getMapByType(type)
    const selected = restMap[slug && slug.toUpperCase()] === optMap && optMap !== undefined

    return [
      ...acc,
      {
        ...opt,
        selected,
        type,
        slug,
      },
    ]
  }, [])
}

// TODO: move this logic to facets resolver
export function formatCategoriesTree(tree) {
  const format = (tree, parentPath, level) => {
    if (tree.length === 0) {
      return []
    }

    return tree.reduce((categories, node) => {
      // Remove the accents and diacritics of the string
      const normalizedName = node.Name.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      const nodePath = parentPath ? `${parentPath}/${normalizedName}` : normalizedName
      return [
        ...categories,
        {
          Quantity: node.Quantity,
          Name: node.Name,
          Link: node.Link,
          path: nodePath,
          level,
        },
        ...format(node.Children, nodePath, level + 1),
      ]
    }, [])
  }

  return format(tree, '', 0)
}

export function getFilterTitle(title = '', intl) {
  return intl.messages[title]
    ? intl.formatMessage({ id: title })
    : title
}
