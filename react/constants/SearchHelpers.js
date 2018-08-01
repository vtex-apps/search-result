import QueryString from 'query-string'
import SortOptions from './SortOptions'

export function joinPathWithRest(path, rest) {
  return stripPath(path) + ((rest && `/${rest.replace(/,/g, '/')}`) || '')
}

export function getCategoriesFromQuery(query, map) {
  return getValuesByMap(stripPath(query), map, 'c')
}

function getValuesByMap(query, map, mapValue) {
  const values = query.split('/')
  const mapValues = map.split(',')
  return mapValues.slice(0, values.length).reduce((filteredValues, map, index) => {
    if (map === mapValue) filteredValues.push(values[index])
    return filteredValues
  }, [])
}

export function findInTree(tree, values, index) {
  if (!(tree && tree.length && values.length)) return
  for (let i = 0; i < tree.length; i++) {
    const categorySlug = stripPath(tree[i].Link).split('/')[index]
    if (categorySlug.toUpperCase() === values[index].toUpperCase()) {
      if (index === values.length - 1) {
        return tree[i]
      }
      return findInTree(tree[i].Children, values, index + 1)
    }
  }
  return tree[0]
}

export function stripPath(pathName) {
  return pathName
    .replace(/^\//i, '')
    .replace(/\/s$/i, '')
    .replace(/\/d$/i, '')
    .replace(/\/b$/i, '')
}

export function getSpecificationFilterFromLink(link) {
  return `specificationFilter_${link.split('specificationFilter_')[1]}`
}

export function getMapByType(type) {
  switch (type) {
    case 'PriceRanges':
      return 'priceFrom'
    case 'Categories':
      return 'c'
    case 'Brands':
      return 'b'
  }
}

/**
 * Returns an object mapped by restValue and your mapValue.
 */
export function restMapped(query, rest, map) {
  const queryLength = query.split('/').length
  const restValues = (rest && rest.split(',')) || []
  const mapValues = (map && map.split(',')) || []
  const mapValuesSliced = mapValues.slice(queryLength)
  return restValues.reduce((acc, value, index) => {
    acc[value.toUpperCase()] = mapValuesSliced[index]
    return acc
  }, {})
}

export function getSlugFromLink(link) {
  const { url } = QueryString.parseUrl(link)
  return stripPath(url).split('/').pop()
}

export function getPagesArgs(
  { type, link },
  rest,
  { map, orderBy, pageNumber = 1 },
  pagesPath,
  params,
  isUnselectLink
) {
  const restValues = (rest && rest.split(',')) || []
  const mapValues = (map && map.split(',')) || []
  const slug = getSlugFromLink(link, type)
  if (isUnselectLink) {
    const paramsLength = Object.keys(params).filter(
      param => !param.startsWith('_')
    ).length

    const index = restValues.findIndex(
      item => slug.toLowerCase() === item.toLowerCase()
    )
    if (index !== -1) {
      restValues.splice(index, 1)
      mapValues.splice(paramsLength + index, 1)
    }
  } else {
    let map = getMapByType(type)
    if (type === 'SpecificationFilters') {
      map = getSpecificationFilterFromLink(link)
    }
    restValues.push(slug)
    mapValues.push(map)
  }

  const queryString = QueryString.stringify({
    map: mapValues.join(','),
    page: pageNumber !== 1 ? pageNumber : undefined,
    order: orderBy === SortOptions[0].value ? undefined : orderBy,
    rest: restValues.join(',') || undefined,
  })
  return { page: pagesPath, params, queryString }
}

export function mountOptions(options, type, query, map, rest) {
  const restMap = restMapped(query, rest, map)
  return options.reduce((acc, opt) => {
    const slug = getSlugFromLink(opt.Link)
    let optMap = getMapByType(type)
    if (type === 'SpecificationFilters') {
      optMap = getSpecificationFilterFromLink(opt.Link)
    }
    const selected = restMap[slug && slug.toUpperCase()] === optMap
    acc.push({
      ...opt,
      selected,
      type,
      slug,
    })
    return acc
  }, [])
}
