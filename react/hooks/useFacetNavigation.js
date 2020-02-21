import { zip } from 'ramda'
import { useCallback } from 'react'
import { useRuntime } from 'vtex.render-runtime'
import { useQuery } from '../components/QueryContext'
import { useFilterNavigator } from '../components/FilterNavigatorContext'
import { newFacetPathName } from '../utils/slug'
import { HEADER_SCROLL_OFFSET } from '../constants/SearchHelpers'
import {
  MAP_CATEGORY_CHAR,
  MAP_QUERY_KEY,
  MAP_VALUES_SEP,
  PATH_SEPARATOR,
} from '../constants'

const scrollOptions = {
  baseElementId: 'search-result-anchor',
  top: -HEADER_SCROLL_OFFSET,
}

const removeElementAtIndex = (strArray, index) =>
  strArray.filter((_, i) => i !== index)

const upsert = (array, item) => {
  const foundItemIndex = array.findIndex(e => e.name === item.name)
  if (foundItemIndex === -1) {
    array.push(item)
  } else {
    array[foundItemIndex] = item
  }
}

const removeMapForNewURLFormat = (queryAndMap, selectedFacets) => {
  const mapsToFilter = selectedFacets.reduce((acc, facet) => {
    return facet.map === MAP_CATEGORY_CHAR ||
      (facet.newQuerySegment &&
        facet.newQuerySegment.toLowerCase() !== facet.value.toLowerCase())
      ? acc.concat(facet.map)
      : acc
  }, [])
  return queryAndMap.map.filter(map => !mapsToFilter.includes(map))
}

const getCleanUrlParams = currentMap => {
  const urlParams = new URLSearchParams(window.location.search)
  urlParams.set(MAP_QUERY_KEY, currentMap)
  if (!currentMap) {
    urlParams.delete(MAP_QUERY_KEY)
  }
  return urlParams
}

export const convertSegmentsToNewURLs = (
  querySegments,
  mapSegments,
  facets
) => {
  const newQuerySegments = querySegments.map(querySegment => {
    const selectedFacet = facets.find(
      facet => facet.value.toLowerCase() === querySegment.toLowerCase()
    )
    const newSegment = selectedFacet
      ? selectedFacet.newQuerySegment
        ? selectedFacet.newQuerySegment
        : newFacetPathName(selectedFacet)
      : querySegment
    return newSegment
  })
  return { map: mapSegments, query: newQuerySegments }
}

const buildQueryAndMap = (
  querySegments,
  mapSegments,
  facets,
  selectedFacets,
  preventRouteChange
) => {
  const queryAndMap = facets.reduce(
    ({ query, map }, facet) => {
      const facetValue = preventRouteChange
        ? facet.value
        : newFacetPathName(facet)
      facet.newQuerySegment = facetValue
      if (facet.selected) {
        const facetIndex = zip(query, map).findIndex(
          ([value, valueMap]) =>
            decodeURIComponent(value).toLowerCase() ===
              decodeURIComponent(facetValue).toLowerCase() &&
            valueMap === facet.map
        )
        selectedFacets = selectedFacets.filter(
          selectedFacet => selectedFacet.value !== facet.value
        )
        return {
          query: removeElementAtIndex(querySegments, facetIndex),
          map: removeElementAtIndex(mapSegments, facetIndex),
        }
      } else {
        upsert(selectedFacets, facet)
      }

      if (facet.map === MAP_CATEGORY_CHAR) {
        const lastCategoryIndex = map.lastIndexOf(MAP_CATEGORY_CHAR)
        if (lastCategoryIndex >= 0 && lastCategoryIndex !== map.length - 1) {
          // Corner case: if we are adding a category but there are other filter other than category applied. Add the new category filter to the right of the other categories.
          return {
            query: [
              ...query.slice(0, lastCategoryIndex + 1),
              facetValue,
              ...query.slice(lastCategoryIndex + 1),
            ],
            map: [
              ...map.slice(0, lastCategoryIndex + 1),
              facet.map,
              ...map.slice(lastCategoryIndex + 1),
            ],
          }
        }
      }

      return {
        query: [...query, facetValue],
        map: [...map, facet.map],
      }
    },
    { query: querySegments, map: mapSegments }
  )
  return {
    query: queryAndMap.query.join(PATH_SEPARATOR),
    map: preventRouteChange
      ? queryAndMap.map
      : removeMapForNewURLFormat(queryAndMap, selectedFacets).join(
          MAP_VALUES_SEP
        ),
  }
}

export const buildNewQueryMap = (
  query,
  map,
  facets,
  selectedFacets,
  preventRouteChange
) => {
  const querySegments = (query && query.split(PATH_SEPARATOR)) || []
  const mapSegments = (map && map.split(MAP_VALUES_SEP)) || []

  const { query: newQuerySegments, map: newMapSegments } = preventRouteChange
    ? { map: mapSegments, query: querySegments }
    : convertSegmentsToNewURLs(querySegments, mapSegments, selectedFacets)

  return buildQueryAndMap(
    newQuerySegments,
    newMapSegments,
    facets,
    selectedFacets,
    preventRouteChange
  )
}

const useFacetNavigation = selectedFacets => {
  const { navigate, setQuery } = useRuntime()
  const { query } = useQuery()
  const { map } = useFilterNavigator()

  const navigateToFacet = useCallback(
    (maybeFacets, preventRouteChange = false) => {
      const facets = Array.isArray(maybeFacets) ? maybeFacets : [maybeFacets]
      const { query: currentQuery, map: currentMap } = buildNewQueryMap(
        query,
        map,
        facets,
        selectedFacets,
        preventRouteChange
      )

      if (preventRouteChange) {
        setQuery({
          map: `${currentMap}`,
          query: `/${currentQuery}`,
          page: undefined,
        })
        return
      }

      const urlParams = getCleanUrlParams(currentMap)

      navigate({
        to: `${PATH_SEPARATOR}${currentQuery}`,
        query: urlParams.toString(),
        scrollOptions,
        modifiersOptions: {
          LOWERCASE: false,
        },
      })
    }
  )

  return navigateToFacet
}

export default useFacetNavigation
