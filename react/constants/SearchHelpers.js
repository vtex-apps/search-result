import { repeat } from 'ramda'

import { SORT_OPTIONS } from '../components/OrderBy'
import {
  CATEGORIES_TYPE,
  BRANDS_TYPE,
  PRICE_RANGES_TYPE,
  SPECIFICATION_FILTERS_TYPE,
} from '../components/FiltersContainer'

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

function removeFilter(map, rest, { type, slug, pagesPath }) {
  let skip = 0

  if (pagesPath === 'store/department') {
    skip = 1
  } else if (pagesPath === 'store/category') {
    skip = 2
  } else if (pagesPath === 'store/subcategory') {
    skip = 3
  }

  const categoryMapSymbol = getMapByType(CATEGORIES_TYPE)

  const restIndex = rest.findIndex(
    item => slug.toLowerCase() === item.toLowerCase()
  )

  if (restIndex === -1) {
    return { map, rest }
  }

  let mapIndex = -1
  let count = skip - 1

  for (const symbol of map) {
    mapIndex++

    if (symbol === categoryMapSymbol && skip > 0) {
      skip--
    } else if (count === restIndex) {
      break
    } else {
      count++
    }
  }

  if (type !== CATEGORIES_TYPE) {
    return {
      map: map.filter((_, i) => i !== mapIndex),
      rest: rest.filter((_, i) => i !== restIndex),
    }
  }

  return {
    rest: rest
      .filter((_, i) => {
        if (i < restIndex) {
          return true
        } else if (i === restIndex) {
          return false
        }
        return map[i + mapIndex] !== categoryMapSymbol
      }),
    map: map
      .filter((mapValue, i) => {
        if (i < mapIndex) {
          return true
        } else if (i === mapIndex) {
          return false
        }
        return mapValue !== categoryMapSymbol
      }),
  }
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

  let categoryIndex = map.filter(m => m === mapSymbol).length

  if (pagesPath === 'store/department') {
    categoryIndex = Math.max(1, categoryIndex)
  } else if (pagesPath === 'store/category') {
    categoryIndex = Math.max(2, categoryIndex)
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
  query: {
    rest = [],
    map = [],
    order,
    priceRange,
  } = {},
  type,
  params,
  path,
  slug,
  link,
  pageNumber = 1,
  pagesPath,
  isUnselectLink,
}) {
  const query = {
    map,
    rest,
    page: pageNumber !== 1 ? pageNumber : undefined,
    order: order !== SORT_OPTIONS[0].value ? order : undefined,
    priceRange,
  }

  switch (type) {
    case PRICE_RANGES_TYPE:
      query.priceRange = slug
      break
    // TODO: Specification filters should also go on a separate parameter
    case SPECIFICATION_FILTERS_TYPE:
    case BRANDS_TYPE:
    case CATEGORIES_TYPE: {
      const filters = isUnselectLink
        ? removeFilter(map, rest, { type, slug, pagesPath })
        : addFilter(map, rest, { type, link, path, slug, pagesPath })

      query.map = filters.map
      query.rest = filters.rest
      break
    }
    default:
      break
  }

  return {
    page: pagesPath,
    params,
    order,
    query,
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
    const slug = opt.Slug || opt.normalizedName || opt.Name
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
export function formatCategoriesTree(root) {
  const format = (tree = [], parentPath = '', level = 0) => {
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
          Id: node.Id,
          Slug: node.Slug && node.Slug.replace(',', ''),
          Quantity: node.Quantity,
          Name: node.Name,
          Link: node.Link,
          normalizedName,
          path: nodePath,
          level,
        },
        ...format(node.Children, nodePath, level + 1),
      ]
    }, [])
  }

  return format(root)
}

export function getFilterTitle(title = '', intl) {
  return intl.messages[title]
    ? intl.formatMessage({ id: title })
    : title
}

export function formatFacetToLinkPropsParam(type, option, oneSelectedCollapse = false) {
  return {
    name: option.Name,
    link: option.Link,
    path: option.path,
    slug: option.Slug,
    isSelected: option.selected,
    oneSelectedCollapse,
    type,
  }
}
