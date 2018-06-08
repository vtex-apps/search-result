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
  const page = 'store/search'
  const params = { term: pathValues[0] }
  const Q = pathValues.splice(1).join(',') || undefined
  const queryString = QueryString.stringify({ map, page: 1, orderBy, Q })
  return { page, params, queryString }
}
