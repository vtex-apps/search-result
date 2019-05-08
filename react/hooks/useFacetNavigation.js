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

      const urlParams = new URLSearchParams(window.location.search)

      const { currentParams, currentQuery } = facets.reduce(
        ({ currentQuery, currentParams }, facet) => {
          if (facet.selected) {
            const facetIndex = query
              .toLowerCase()
              .split('/')
              .map(decodeURIComponent)
              .findIndex(
                value => value === decodeURIComponent(facet.value).toLowerCase()
              )

            const clonedParams = new URLSearchParams(currentParams)

            clonedParams.set('map', removeElementAtIndex(map, facetIndex, ','))

            return {
              currentQuery: removeElementAtIndex(currentQuery, facetIndex, '/'),
              currentParams: clonedParams,
            }
          } else {
            const clonedParams = new URLSearchParams(currentParams)

            clonedParams.set('map', `${map},${facet.map}`)

            return {
              currentQuery: `${query}/${facet.value}`,
              currentParams: clonedParams,
            }
          }
        },
        { currentQuery: query, currentParams: urlParams }
      )

      navigate({
        to: `/${currentQuery}`,
        query: currentParams.toString(),
        scrollOptions,
      })
    },
    [map, navigate, query]
  )

  return navigateToFacet
}

export default useFacetNavigation
