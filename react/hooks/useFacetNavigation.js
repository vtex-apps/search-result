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

const removeElementAtIndex = (str, index) => str.filter((_, i) => i !== index)

const newFacetPathName = facet => {
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

const getCleanUrlParams = currentMap => {
  const urlParams = new URLSearchParams(window.location.search)
  urlParams.set(MAP_QUERY_KEY, currentMap)
  if (!currentMap) {
    urlParams.delete(MAP_QUERY_KEY)
  }
  return urlParams
}

const getStaticPathSegments = facets => {
  const fieldsNotNormalizable = [...facets, ...Object.values(selectedFacets)]
    .filter(facet => facet.map !== 'c')
    .map(facet => newFacetPathName(facet))
    .join(PATH_SEPARATOR)
  const modifiersIgnore = {
    [fieldsNotNormalizable]: {
      path: fieldsNotNormalizable,
    },
  }
  return modifiersIgnore
}

const convertSegmentsToNewURLs = (querySegments, mapSegments, facetsLookup) => {
  const facets = Object.values(facetsLookup)
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

export const buildQueryAndMap = (querySegments, mapSegments, facets) => {
  const queryAndMap = facets.reduce(
    ({ query, map }, facet) => {
      const facetValue = newFacetPathName(facet)
      facet.newQuerySegment = facetValue
      if (facet.selected) {
        const facetIndex = zip(query, map).findIndex(
          ([value, valueMap]) =>
            value.toLowerCase() === facetValue.toLowerCase() &&
            valueMap === facet.map
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
    map: removeMapForNewURLFormat(queryAndMap).join(MAP_VALUES_SEP),
  }
}

const useFacetNavigation = map => {
  const { navigate } = useRuntime()
  const { query } = useQuery()

  const navigateToFacet = useCallback(maybeFacets => {
    const facets = Array.isArray(maybeFacets) ? maybeFacets : [maybeFacets]

    const querySegments = query.split(PATH_SEPARATOR)
    const mapSegments = map.split(MAP_VALUES_SEP)

    const {
      query: newQuerySegments,
      map: newMapSegments,
    } = convertSegmentsToNewURLs(querySegments, mapSegments, selectedFacets)

    const { query: currentQuery, map: currentMap } = buildQueryAndMap(
      newQuerySegments,
      newMapSegments,
      facets
    )

    const urlParams = getCleanUrlParams(currentMap)
    const modifiersIgnore = getStaticPathSegments([
      ...Object.values(selectedFacets),
      ...facets,
    ])

    navigate({
      to: `${PATH_SEPARATOR}${currentQuery}`,
      query: urlParams.toString(),
      scrollOptions,
      modifiersIgnore,
    })
  })

  navigateToFacet.storeSelectedFacets = storeSelectedFacets
  return navigateToFacet
}

export default useFacetNavigation
