import { zip } from 'ramda'
import { useCallback, useContext } from 'react'
import { useRuntime } from 'vtex.render-runtime'

import QueryContext from '../components/QueryContext'
import { HEADER_SCROLL_OFFSET } from '../constants/SearchHelpers'

const scrollOptions = {
  baseElementId: 'search-result-anchor',
  top: -HEADER_SCROLL_OFFSET,
}

const removeElementAtIndex = (str, index, separator) =>
  str
    .split(separator)
    .filter((_, i) => i !== index)
    .join(separator)

export const buildQueryAndMap = (inputQuery, inputMap, facets) =>
  facets.reduce(
    ({ query, map }, facet) => {
      if (facet.selected) {
        const facetIndex = zip(
          query
            .toLowerCase()
            .split('/')
            .map(decodeURIComponent),
          map.split(',')
        ).findIndex(
          ([value, valueMap]) =>
            value === decodeURIComponent(facet.value).toLowerCase() &&
            valueMap === facet.map
        )

        return {
          query: removeElementAtIndex(query, facetIndex, '/'),
          map: removeElementAtIndex(map, facetIndex, ','),
        }
      }

      return {
        query: `${query}/${facet.value}`,
        map: `${map},${facet.map}`,
      }
    },
    { query: inputQuery, map: inputMap }
  )

const useFacetNavigation = () => {
  const { navigate, setQuery } = useRuntime()
  const { query, map } = useContext(QueryContext)

  const navigateToFacet = useCallback(
    (maybeFacets, preventRouteChange = false) => {
      const facets = Array.isArray(maybeFacets) ? maybeFacets : [maybeFacets]

      const { query: currentQuery, map: currentMap } = buildQueryAndMap(
        query,
        map,
        facets
      )

      if (preventRouteChange) {
        setQuery({
          map: `${currentMap}`,
          query: `/${currentQuery}`,
          page: undefined,
        })
        return
      }

      const urlParams = new URLSearchParams(window.location.search)

      urlParams.set('map', currentMap)
      urlParams.delete('page')
      urlParams.delete('query')

      navigate({
        to: `/${currentQuery}`,
        query: urlParams.toString(),
        scrollOptions,
      })
    },
    [query, map, navigate, setQuery]
  )

  return navigateToFacet
}

export default useFacetNavigation
