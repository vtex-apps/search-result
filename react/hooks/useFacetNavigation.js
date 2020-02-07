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
  SPEC_FILTER,
} from '../constants'

const scrollOptions = {
  baseElementId: 'search-result-anchor',
  top: -HEADER_SCROLL_OFFSET,
}

const removeElementAtIndex = (strArray, index) =>
  strArray.filter((_, i) => i !== index)

const removeMapForNewURLFormat = (queryAndMap, selectedFacets) => {
  return queryAndMap.map.filter(
    mapValue =>
      selectedFacets.findIndex(facet => facet.map === mapValue) === -1 ||
      (mapValue !== MAP_CATEGORY_CHAR && !mapValue.includes(SPEC_FILTER))
  )
}

const getCleanUrlParams = currentMap => {
  const urlParams = new URLSearchParams(window.location.search)
  urlParams.set(MAP_QUERY_KEY, currentMap)
  if (!currentMap) {
    urlParams.delete(MAP_QUERY_KEY)
  }
  return urlParams
}

const getStaticPathSegments = facets => {
  const fieldsNotNormalizable = facets
    .filter(facet => facet.map.includes(SPEC_FILTER))
    .map(facet => newFacetPathName(facet))
    .join(PATH_SEPARATOR)
  const modifiersIgnore = {
    [fieldsNotNormalizable]: {
      path: fieldsNotNormalizable,
    },
  }
  return modifiersIgnore
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
      ? selectedFacet.newFacetPathName
        ? selectedFacet.newFacetPathName
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
  selectedFacets
) => {
  const queryAndMap = facets.reduce(
    ({ query, map }, facet) => {
      const facetValue = newFacetPathName(facet)
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
    map: removeMapForNewURLFormat(queryAndMap, selectedFacets).join(
      MAP_VALUES_SEP
    ),
  }
}

export const buildNewQueryMap = (query, map, facets, selectedFacets) => {
  const querySegments = (query && query.split(PATH_SEPARATOR)) || []
  const mapSegments = (map && map.split(MAP_VALUES_SEP)) || []

  const {
    query: newQuerySegments,
    map: newMapSegments,
  } = convertSegmentsToNewURLs(querySegments, mapSegments, selectedFacets)

  return buildQueryAndMap(
    newQuerySegments,
    newMapSegments,
    facets,
    selectedFacets
  )
}

const useFacetNavigation = selectedFacets => {
  const { navigate } = useRuntime()
  const { query } = useQuery()
  const { map } = useFilterNavigator()

  const navigateToFacet = useCallback(maybeFacets => {
    const facets = Array.isArray(maybeFacets) ? maybeFacets : [maybeFacets]
    const { query: currentQuery, map: currentMap } = buildNewQueryMap(
      query,
      map,
      facets,
      selectedFacets
    )

    const urlParams = getCleanUrlParams(currentMap)
    const modifiersIgnore = getStaticPathSegments([
      ...selectedFacets,
      ...facets,
    ])

    navigate({
      to: `${PATH_SEPARATOR}${currentQuery}`,
      query: urlParams.toString(),
      scrollOptions,
      modifiersOptions: modifiersIgnore,
    })
  })

  return navigateToFacet
}

export default useFacetNavigation
