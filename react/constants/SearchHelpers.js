import QueryString from 'query-string'

import SortOptions from './SortOptions'

export function getCategoriesFromQuery(query, map) {
  return getValuesByMap(query, map, 'c')
}

function getValuesByMap(query, map, mapValue) {
  const values = query.split('/')
  const mapValues = map.split(',')
  const brands = []
  mapValues.map((value, index) => {
    if (value === mapValue) {
      brands.push(values[index])
    }
  })
  return brands
}

export function findInTree(tree, values, index) {
  if (!(tree.length && values.length)) return
  for (let i = 0; i < tree.length; i++) {
    if (tree[i].Name.toUpperCase() === values[index].toUpperCase()) {
      if (index === values.length - 1) {
        return tree[i]
      }
      return findInTree(tree[i].Children, values, index + 1)
    }
  }
  return tree[0]
}

function getSpecificationFilterFromLink(link) {
  return `specificationFilter_${link.split('specificationFilter_')[1]}`
}

export function getPagesArgs(
  { name, type, link },
  rest,
  { map, orderBy, pageNumber = 1 },
  pagesPath,
  params,
  isUnselectLink
) {
  const restValues = (rest && rest.split(',')) || []
  const mapValues = (map && map.split(',')) || []
  if (name) {
    if (isUnselectLink) {
      const paramsLength = Object.keys(params).filter(
        param => !param.startsWith('_')
      ).length
      const index = restValues.findIndex(
        item => name.toLowerCase() === item.toLowerCase()
      )
      if (index !== -1) {
        restValues.splice(index, 1)
        mapValues.splice(paramsLength + index, 1)
      }
    } else {
      switch (type) {
        case 'Brands': {
          mapValues.push('b')
          break
        }
        case 'SpecificationFilters': {
          mapValues.push(`${getSpecificationFilterFromLink(link)}`)
          break
        }
        default: {
          mapValues.push('c')
        }
      }
      restValues.push(name)
    }
  }

  const queryString = QueryString.stringify({
    map: mapValues.join(','),
    page: pageNumber !== 1 ? pageNumber : undefined,
    order: orderBy === SortOptions[0].value ? undefined : orderBy,
    rest: restValues.join(',') || undefined,
  })
  return { page: pagesPath, params, queryString }
}
