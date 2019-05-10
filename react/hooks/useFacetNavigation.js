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

const useFacetNavigation = () => {
  const { navigate } = useRuntime()
  const { query, map } = useContext(QueryContext)

  const navigateToFacet = useCallback(
    maybeFacets => {
      const facets = Array.isArray(maybeFacets) ? maybeFacets : [maybeFacets]

      const { currentQuery, currentMap } = facets.reduce(
        ({ currentQuery, currentMap }, facet) => {
          if (facet.selected) {
            const facetIndex = zip(
              currentQuery
                .toLowerCase()
                .split('/')
                .map(decodeURIComponent),
              currentMap.split(',')
            ).findIndex(
              ([value, valueMap]) =>
                value === decodeURIComponent(facet.value).toLowerCase() &&
                valueMap === facet.map
            )

            return {
              currentQuery: removeElementAtIndex(currentQuery, facetIndex, '/'),
              currentMap: removeElementAtIndex(currentMap, facetIndex, ','),
            }
          }

          return {
            currentQuery: `${currentQuery}/${facet.value}`,
            currentMap: `${currentMap},${facet.map}`,
          }
        },
        { currentQuery: query, currentMap: map }
      )

      const urlParams = new URLSearchParams(window.location.search)

      urlParams.set('map', currentMap)

      navigate({
        to: `/${currentQuery}`,
        query: urlParams.toString(),
        scrollOptions,
      })
    },
    [navigate, query, map]
  )

  return navigateToFacet
}

export default useFacetNavigation
