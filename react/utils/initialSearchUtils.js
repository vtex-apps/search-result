import { PATH_SEPARATOR, MAP_VALUES_SEP } from '../constants'

export const isInitialFacet = (facet, initialSearch) => {
  if (!initialSearch) {
    return false
  }

  const initialFacets = initialSearch.specificationFilters.flatMap(filter =>
    filter.facets.filter(facet => facet.selected)
  )

  return initialFacets.some(
    initialFacet =>
      initialFacet.key === facet.key && initialFacet.value === facet.value
  )
}

export const filterInitialSelected = (context, initialSearch) => {
  const query = context.query.split(PATH_SEPARATOR)
  const map = context.map.split(MAP_VALUES_SEP)
  const newQuery = []
  const newMap = []
  for (let i = 0; i < map.length; i++) {
    if (isInitialFacet({ key: map[i], value: query[i] }, initialSearch)) {
      newQuery.push(query[i])
      newMap.push(map[i])
    }
  }
  return {
    query: newQuery.join(PATH_SEPARATOR),
    map: newMap.join(MAP_VALUES_SEP),
  }
}
