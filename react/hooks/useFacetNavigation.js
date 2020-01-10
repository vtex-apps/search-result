import { zip } from 'ramda'
import { useCallback } from 'react'
import { useRuntime } from 'vtex.render-runtime'
import { useQuery } from '../components/QueryContext'

import { HEADER_SCROLL_OFFSET } from '../constants/SearchHelpers'

const SPEC_FILTER = 'specificationFilter'
const MAP_CATEGORY_CHAR = 'c'
const MAP_QUERY_KEY = 'map'
const MAP_VALUES_SEP = ','
const PATH_SEPARATOR = '/'
const SPACE_REPLACER = '-'
const FILTER_TITLE_SEP = '_'

const scrollOptions = {
  baseElementId: 'search-result-anchor',
  top: -HEADER_SCROLL_OFFSET,
}

const selectedFacets = {}

const storeSelectedFacets = selectedFacet => {
  if (selectedFacet) {
    selectedFacets[selectedFacet.value] = selectedFacet
  }
}

const removeSelectedFacets = selectedFacet => {
  if (selectedFacet) {
    delete selectedFacets[selectedFacet.value]
  }
}

const isLegacySearchFormat = (query, mapSegments, pathSegments) => {
  return (
    query.includes(SPEC_FILTER) ||
    (mapSegments && mapSegments.length === pathSegments.length)
  )
}

const removeElementAtIndex = (str, index) => str.filter((_, i) => i !== index)

const newFacetPathName = (facet, isLegacySearch) => {
  if (isLegacySearch && facet.selected) {
    return facet.value
  }

  return facet.map && facet.map.includes(SPEC_FILTER)
    ? `${facet.title
        .replace(/\s/g, SPACE_REPLACER)
        .toLowerCase()}${FILTER_TITLE_SEP}${facet.value.replace(
        /\s/g,
        SPACE_REPLACER
      )}`
    : facet.value
}

const removeMapForNewURLFormat = queryAndMap => {
  return queryAndMap.map.filter(
    mapValue =>
      mapValue !== MAP_CATEGORY_CHAR && !mapValue.includes(SPEC_FILTER)
  )
}

export const buildQueryAndMap = (
  querySegments,
  mapSegments,
  facets,
  isLegacySearch
) => {
  const queryAndMap = facets.reduce(
    ({ query, map }, facet) => {
      const facetValue = newFacetPathName(facet, isLegacySearch)
      if (facet.selected) {
        const facetIndex = zip(query, map).findIndex(
          ([value, valueMap]) => value === facetValue && valueMap === facet.map
        )
        removeSelectedFacets(facet[facetIndex])
        return {
          query: removeElementAtIndex(query, facetIndex, PATH_SEPARATOR),
          map: removeElementAtIndex(map, facetIndex, MAP_VALUES_SEP),
        }
      }

      if (facet.map === MAP_CATEGORY_CHAR) {
        const lastCategoryIndex = map.lastIndexOf(MAP_CATEGORY_CHAR)
        if (lastCategoryIndex >= 0 && lastCategoryIndex !== map.length - 1) {
          // Corner case: if we are adding a category but there are other filter other than category applied. Add the new category filter to the right of the other categories.
          return {
            query: [
              ...query.slice(0, lastCategoryIndex + 1),
              facet.value,
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
    map: removeMapForNewURLFormat(queryAndMap).join(MAP_VALUES_SEP),
  }
}

const useFacetNavigation = (map, selectedFacet) => {
  const { navigate } = useRuntime()
  const { query, map: queryMap } = useQuery()
  storeSelectedFacets(selectedFacet)

  const navigateToFacet = useCallback(maybeFacets => {
    const facets = Array.isArray(maybeFacets) ? maybeFacets : [maybeFacets]

    const querySegments = query.split(PATH_SEPARATOR)
    const mapSegments = map.split(MAP_VALUES_SEP)

    const isLegacySearch = isLegacySearchFormat(
      query,
      queryMap.split(MAP_VALUES_SEP),
      querySegments
    )

    const { query: currentQuery, map: currentMap } = buildQueryAndMap(
      querySegments,
      mapSegments,
      facets,
      isLegacySearch
    )

    const urlParams = new URLSearchParams(window.location.search)
    urlParams.set(MAP_QUERY_KEY, currentMap)
    if (!currentMap) {
      urlParams.delete(MAP_QUERY_KEY)
    }

    const fieldsNotNormalizable = [...facets, ...Object.values(selectedFacets)]
      .filter(facet => facet.map !== 'c')
      .map(facet => newFacetPathName(facet, isLegacySearch))
      .join(PATH_SEPARATOR)
    const modifiersIgnore = {
      [fieldsNotNormalizable]: {
        path: fieldsNotNormalizable,
      },
    }

    navigate({
      to: `${PATH_SEPARATOR}${currentQuery}`,
      query: urlParams.toString(),
      scrollOptions,
      modifiersIgnore,
    })
  })

  return navigateToFacet
}

export default useFacetNavigation
