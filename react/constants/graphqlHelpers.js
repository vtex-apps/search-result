/**
 * Returns a string representing the facets param based in the location pathName and queryString.
 * e.g: smartphones?map=c
 * e.g2: eletronics/smartphones?map=c,c
 */
export function getFacetsFromURL(pathName, queryParams, isLink, isBrand) {
  const { query, map } = getSearchParamsFromURL(pathName, queryParams, isLink, isBrand)
  return `${query}${map ? `?map=${map}` : ''}`
}

export function getSearchParamsFromURL(pathName, queryParams, isLink, isBrand) {
  let query = ''
  let map = ''
  if (pathName) {
    const newPathName = pathName.slice(1)
    const resources = newPathName.split('/')
    if (!isLink) {
      resources.pop()
    }
    query = resources.join('/')
    if (queryParams.map) {
      return { query, map: queryParams.map }
    }
    if (resources && resources.length) {
      if (isLink && resources.length) {
        map = Array(resources.length - 1).fill('c').join(',') + (resources.length > 1 ? ',' : '') + (isBrand ? 'b' : 'c')
      } else {
        map = Array(resources.length).fill('c').join(',')
      }
    }
  }

  return { query, map }
}
