import { zip } from 'ramda'
import { useFilterNavigator } from '../components/FilterNavigatorContext'
import { MAP_CATEGORY_CHAR, DEPARTMENT, CATEGORY } from '../constants'

/**
 * This hook is required because we make the facets query
 * with only the categories and fulltext parameters, so we
 * need to calculate manually if the other filters are selected
 */
const useSelectedFilters = facets => {
  const { query, map } = useFilterNavigator()
  if (!query && !map) {
    return []
  }

  const queryAndMap = zip(
    query
      .toLowerCase()
      .split('/')
      .map(decodeURIComponent),
    map.split(',')
  )

  /* With the addition of the new VTEX search, it is possible to have different maps.
  This function checks the equivalent possibilities for the 'c' map */
  const checkMap = (slugMap, facetMap) => {
    if (slugMap === MAP_CATEGORY_CHAR) {
      return (
        facetMap === MAP_CATEGORY_CHAR ||
        facetMap === DEPARTMENT ||
        facetMap === CATEGORY
      )
    }
    return slugMap === facetMap
  }

  return facets.map(facet => {
    const currentFacetSlug = decodeURIComponent(facet.value).toLowerCase()

    const isSelected =
      queryAndMap.find(
        ([slug, slugMap]) =>
          slug === currentFacetSlug && checkMap(slugMap, facet.map)
      ) !== undefined

    return {
      ...facet,
      selected: isSelected,
    }
  })
}

export default useSelectedFilters
