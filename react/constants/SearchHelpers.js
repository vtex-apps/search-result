import QueryString from 'query-string'

/**
 * Returns a string representing the facets param based in the location pathName and queryString.
 * e.g: smartphones?map=c
 * e.g2: eletronics/smartphones?map=c,c
 */
export function getFacetsFromURL(pathName, queryParams, isBrand) {
  const { query, map } = getSearchParamsFromURL(pathName, queryParams, isBrand)
  return `${query}${map ? `?map=${map}` : ''}`
}

export function getSearchParamsFromURL(pathName, queryParams, isBrand) {
  let map = ''
  if (queryParams && queryParams.map) {
    map = queryParams.map
  } else {
    const pathValues = pathName.split('/')
    map = Array(pathValues.length - 1).fill('c').join(',') + (pathValues.length > 1 ? ',' : '') + (isBrand ? 'b' : 'c')
  }

  return { query: pathName, map }
}

export function getSelecteds(query, map) {
  const selecteds = {
    SpecificationFilters: [],
    Departments: [],
    Brands: [],
    FullText: [],
  }

  if (!query && !map) return selecteds

  const pathValues = query.split('/')
  const mapValues = map.split(',')
  pathValues.map((val, i) => {
    const valDecoded = decodeURI(val.toUpperCase())
    if (i > mapValues.length - 1) {
      selecteds.Departments.push(valDecoded)
    } else {
      if (mapValues[i] === 'c') {
        selecteds.Departments.push(valDecoded)
      } else if (mapValues[i] === 'b') {
        selecteds.Brands.push(valDecoded)
      } else if (mapValues[i].indexOf('specificationFilter') !== -1) {
        selecteds.SpecificationFilters.push(valDecoded)
      } else if (mapValues[i] === 'ft') {
        selecteds.FullText = [valDecoded]
      }
    }
  })

  return selecteds
}

export function countSelecteds(selecteds) {
  let count = 0
  for (const key in selecteds) {
    if (selecteds[key]) {
      count += selecteds[key].length
    }
  }
  return count
}

export function getUnselectedLink(optName, query, map) {
  const pathValues = query.split('/')
  const mapValues = map.split(',')
  for (let i = 0; i < pathValues.length; i++) {
    if (decodeURI(pathValues[i].toUpperCase()) === optName.toUpperCase()) {
      pathValues.splice(i, 1)
      mapValues.splice(i, 1)
      return `${pathValues.join('/')}?map=${mapValues.join(',')}`
    }
  }
  return `${pathValues.join('/')}?map=${mapValues.join(',')}`
}

export function getLink(link, type) {
  const { url: pathName, query: queryParams } = QueryString.parseUrl(link)
  return getFacetsFromURL(pathName, queryParams, type === 'Brands')
}

export function getPagesArgs(opt, queryArg, mapArg, orderBy, isUnselectLink, type) {
  let query = queryArg
  let map = mapArg
  if (opt) {
    const newLink = isUnselectLink ? getUnselectedLink(opt.Name, queryArg, mapArg) : getLink(opt.Link.slice(1), type)
    query = QueryString.parseUrl(newLink).url
    map = QueryString.parseUrl(newLink).query.map
  }

  const pathValues = query.split('/')
  const page = `store/search${pathValues.length > 1 ? `/${pathValues.length}` : ''}`
  const params = {}
  const queryString = `map=${map}&page=1${orderBy ? `&O=${orderBy}` : ''}`

  pathValues.map((val, i) => {
    if (i === 0) {
      params.term = val
    } else {
      params[`term${i}`] = val
    }
  })
  return { page, params, queryString }
}
