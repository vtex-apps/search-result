import { SORT_OPTIONS } from '../components/OrderBy'

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

function getMapByType(type) {
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

/**
 * Returns the props to Link component.
 */
export function getPagesArgs({
  type,
  link,
  rest,
  params,
  map,
  orderBy,
  pageNumber = 1,
  pagesPath,
  isUnselectLink,
}) {
  const restValues = rest || []
  const mapValues = map || []
  const slug = getSlugFromLink(link)

  if (link) {
    if (isUnselectLink) {
      const index = restValues.findIndex(
        item => slug.toLowerCase() === item.toLowerCase()
      )
      if (index !== -1) {
        restValues.splice(index, 1)
        mapValues.splice((restValues.length * -1) + index - 1, 1)
      }
    } else {
      const mapParam = type === 'SpecificationFilters'
        ? getSpecificationFilterFromLink(link, mapValues)
        : getMapByType(type)
      restValues.push(slug)
      mapValues.push(mapParam)
    }
  }

  return {
    page: pagesPath,
    params,
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
  const restArray = rest.split(',')

  return mapArray.splice(0, Math.max(mapArray.length - restArray.length, 0)).join(',')
}

export function mountOptions(options, type, map, rest) {
  const restMap = restMapped(rest, map)
  return options.reduce((acc, opt) => {
    const slug = getSlugFromLink(opt.Link)
    let optMap = getMapByType(type)
    if (type === 'SpecificationFilters') {
      optMap = getSpecificationFilterFromLink(opt.Link, map.split(','))
    }
    const selected = restMap[slug && slug.toUpperCase()] === optMap && optMap !== undefined
    return [...acc, {
      ...opt,
      selected,
      type,
      slug,
    }]
  }, [])
}

export function findInTree(tree, values, index) {
  if (!(tree && tree.length && values.length)) return
  for (const node of tree) {
    const categorySlug = stripPath(node.Link).split('/')[index]
    if (categorySlug.toUpperCase() === values[index].toUpperCase()) {
      if (index === values.length - 1) {
        return node
      }
      return findInTree(node.Children, values, index + 1)
    }
  }
  return tree[0]
}

export function getFilterTitle(title = '', intl) {
  return intl.messages[title]
    ? intl.formatMessage({ id: title })
    : title
}
