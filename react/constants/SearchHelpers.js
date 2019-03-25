import { repeat } from 'ramda'
import unorm from 'unorm'

import {
  CATEGORIES_TYPE,
  BRANDS_TYPE,
  PRICE_RANGES_TYPE,
  SPECIFICATION_FILTERS_TYPE,
} from '../FilterNavigator'

/**
 * Returns the parameter name to be used in the map
 */
export function getSpecificationFilterFromLink(link, slug) {
  const [url, queryParams] = link.split('?') // eslint-disable-line no-unused-vars

  const { map } = queryParams.split('&').reduce((acc, param) => {
    const [name, values] = param.split('=')

    return {
      ...acc,
      [name]: values.split(','),
    }
  }, {})

  const urlParams = url.split('/').filter(v => v)

  const urlIndex = urlParams.indexOf(slug)

  if (urlIndex === -1) {
    return undefined
  }

  return map[urlIndex]
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

function removeFilter(map, rest, { slug }) {
  const restIndex = rest.findIndex(
    item => slug.toLowerCase() === item.toLowerCase()
  )

  if (restIndex === -1) {
    return { map, rest }
  }

  // assuming the map is always equals or bigger
  // than the rest, this will never be negative
  const lengthDiff = map.length - rest.length

  const mapIndex = lengthDiff + restIndex

  return {
    map: map.filter((_, i) => i !== mapIndex),
    rest: rest.filter((_, i) => i !== restIndex),
  }
}

function addFilter(map, rest, { path, type, link, pagesPath, slug }) {
  const mapSymbol =
    type === SPECIFICATION_FILTERS_TYPE
      ? getSpecificationFilterFromLink(link, slug)
      : getMapByType(type)

  if (type !== CATEGORIES_TYPE) {
    return {
      rest: [...rest, slug],
      map: [...map, mapSymbol],
    }
  }

  const args = path.split('/')

  let categoryIndex = map.filter(m => m === mapSymbol).length

  if (pagesPath === 'store.search#department') {
    categoryIndex = Math.max(1, categoryIndex)
  } else if (pagesPath === 'store.search#category') {
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
  query: { map = [], order, priceRange } = {},
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
    page: pageNumber !== 1 ? pageNumber : undefined,
    order,
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
        ? removeFilter(map, [], { type, slug, pagesPath })
        : addFilter(map, [], { type, link, path, slug, pagesPath })

      query.map = filters.map
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

export function getBaseMap(map) {
  const mapArray = map.split(',')
  const restArray = [] //rest.split(',').filter(s => s.length > 0)

  return mapArray
    .splice(0, Math.max(mapArray.length - restArray.length, 0))
    .join(',')
}

export function mountOptions(options, type, map) {
  return options.reduce((acc, opt) => {
    let slug

    if (type === BRANDS_TYPE) {
      slug = unorm
        .nfd(opt.Name)
        // Remove the accents
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\d]/g, '-')
    } else {
      slug = opt.Slug || opt.normalizedName || opt.Name
    }

    const optMap =
      type === SPECIFICATION_FILTERS_TYPE
        ? getSpecificationFilterFromLink(opt.Link, slug)
        : getMapByType(type)

    const selected = false
    //restMap.hasOwnProperty(slug.toUpperCase()) &&
    //restMap[slug.toUpperCase()] === optMap

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
      const normalizedName = unorm
        .nfd(node.Name)
        .replace(/[\u0300-\u036f]/g, '')
      const nodePath = parentPath
        ? `${parentPath}/${normalizedName}`
        : normalizedName
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
  return intl.messages[title] ? intl.formatMessage({ id: title }) : title
}

export function formatFacetToLinkPropsParam(
  type,
  option,
  oneSelectedCollapse = false
) {
  return {
    name: option.Name,
    link: option.Link,
    path: option.path,
    slug: option.slug,
    isSelected: option.selected,
    oneSelectedCollapse,
    type,
  }
}

export const HEADER_SCROLL_OFFSET = 90
