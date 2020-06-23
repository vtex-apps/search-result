import { zip } from 'ramda'
import { useCallback } from 'react'
import { useRuntime } from 'vtex.render-runtime'
import { useFilterNavigator } from '../components/FilterNavigatorContext'
import { newFacetPathName } from '../utils/slug'
import { HEADER_SCROLL_OFFSET } from '../constants/SearchHelpers'
import {
  MAP_CATEGORY_CHAR,
  MAP_QUERY_KEY,
  MAP_VALUES_SEP,
  PATH_SEPARATOR,
  FULLTEXT_QUERY_KEY,
  PRODUCT_CLUSTER_IDS,
} from '../constants'
import useSearchState from './useSearchState'
import { getFullTextAndCollection } from '../utils/compatibilityLayer'

const scrollOptions = {
  baseElementId: 'search-result-anchor',
  top: -HEADER_SCROLL_OFFSET,
}

const removeElementAtIndex = (strArray, index) =>
  strArray.filter((_, i) => i !== index)

const upsert = (array, item) => {
  const foundItemIndex = array.findIndex(
    e => e.value === item.value && e.map === item.map
  )
  if (foundItemIndex === -1) {
    array.push(item)
  } else {
    array[foundItemIndex] = item
  }
}

export const compareFacetWithQueryValues = (
  querySegment,
  mapSegment,
  facet
) => {
  return (
    decodeURIComponent(querySegment).toLowerCase() ===
      decodeURIComponent(facet.value).toLowerCase() && mapSegment === facet.map
  )
}

const replaceQueryForNewQueryFormat = (
  queryString,
  mapString,
  selectedFacets
) => {
  const queryArray = queryString.split(PATH_SEPARATOR)
  const mapArray = mapString.split(MAP_VALUES_SEP)
  const newQueryFormatArray = zip(queryArray, mapArray).map(
    ([querySegment, mapSegment]) => {
      const facetForQuery = selectedFacets.find(facet => {
        return compareFacetWithQueryValues(querySegment, mapSegment, facet)
      })
      if (!facetForQuery) {
        return querySegment
      }
      return newFacetPathName(facetForQuery)
    }
  )
  return newQueryFormatArray.join(PATH_SEPARATOR)
}

const removeMapForNewURLFormat = (map, selectedFacets) => {
  const mapArray = map.split(MAP_VALUES_SEP)
  const mapsToFilter = selectedFacets.reduce((acc, facet) => {
    return facet.map === MAP_CATEGORY_CHAR ||
      (facet.newQuerySegment &&
        facet.newQuerySegment.toLowerCase() !== facet.value.toLowerCase())
      ? acc.concat(facet.map)
      : acc
  }, [])
  return mapArray
    .filter(map => !mapsToFilter.includes(map))
    .join(MAP_VALUES_SEP)
}

const getCleanUrlParams = currentMap => {
  const urlParams = new URLSearchParams(window.location.search)
  urlParams.set(MAP_QUERY_KEY, currentMap)
  if (!currentMap) {
    urlParams.delete(MAP_QUERY_KEY)
  }
  return urlParams
}

const buildQueryAndMap = (
  querySegments,
  mapSegments,
  facets,
  selectedFacets
) => {
  const queryAndMap = facets.reduce(
    // The spread on facet is important so we can assign facet.newQuerySegment
    ({ query, map }, { ...facet }) => {
      const facetValue = facet.value
      facet.newQuerySegment = newFacetPathName(facet)
      if (facet.selected) {
        const facetIndex = zip(query, map).findIndex(([value, valueMap]) =>
          compareFacetWithQueryValues(value, valueMap, facet)
        )
        selectedFacets = selectedFacets.filter(
          selectedFacet =>
            selectedFacet.value !== facet.value &&
            selectedFacet.map !== facet.map
        )
        return {
          query: removeElementAtIndex(query, facetIndex),
          map: removeElementAtIndex(map, facetIndex),
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
  const newQueryMap = {
    query: queryAndMap.query.join(PATH_SEPARATOR),
    map: queryAndMap.map.join(MAP_VALUES_SEP),
  }
  return newQueryMap
}

export const buildNewQueryMap = (
  fullTextAndCollection,
  facets,
  selectedFacets
) => {
  let querySegments = selectedFacets.map(facet => facet.value)
  let mapSegments = selectedFacets.map(facet => facet.map)

  const { ft: fullText, productClusterIds: collection } = fullTextAndCollection

  if (fullText) {
    querySegments.push(fullText)
    mapSegments.push(FULLTEXT_QUERY_KEY)
  }

  if (collection) {
    querySegments.push(collection)
    mapSegments.push(PRODUCT_CLUSTER_IDS)
  }

  return buildQueryAndMap(querySegments, mapSegments, facets, selectedFacets)
}

const useFacetNavigation = selectedFacets => {
  const { navigate, setQuery } = useRuntime()
  const { map, query } = useFilterNavigator()
  const { fuzzy, operator, searchState } = useSearchState()

  const fullTextAndCollection = getFullTextAndCollection(query, map)

  const navigateToFacet = useCallback(
    (maybeFacets, preventRouteChange = false) => {
      const facets = Array.isArray(maybeFacets) ? maybeFacets : [maybeFacets]
      const { query: currentQuery, map: currentMap } = buildNewQueryMap(
        fullTextAndCollection,
        facets,
        selectedFacets
      )

      if (preventRouteChange) {
        const queries = {
          map: `${currentMap}`,
          query: `/${currentQuery}`,
          page: undefined,
          fuzzy: fuzzy || undefined,
          operator: operator || undefined,
          searchState: searchState || undefined,
        }

        setQuery(queries)
        return
      }

      const newQuery = replaceQueryForNewQueryFormat(currentQuery, currentMap, [
        ...selectedFacets,
        ...facets,
      ])

      const urlParams = getCleanUrlParams(
        removeMapForNewURLFormat(currentMap, [...selectedFacets, ...facets])
      )

      if (fuzzy) {
        urlParams.set('fuzzy', fuzzy)
      }
      if (operator) {
        urlParams.set('operator', operator)
      }
      if (searchState) {
        urlParams.set('searchState', searchState)
      }

      navigate({
        to: `${PATH_SEPARATOR}${newQuery}`,
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
