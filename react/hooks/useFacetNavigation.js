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
    facet => {
      const urlParams = new URLSearchParams(window.location.search)

      if (facet.selected) {
        const facetIndex = query
          .toLowerCase()
          .split('/')
          .map(decodeURIComponent)
          .findIndex(
            value => value === decodeURIComponent(facet.value).toLowerCase()
          )

        urlParams.set('map', removeElementAtIndex(map, facetIndex, ','))

        navigate({
          to: `/${removeElementAtIndex(query, facetIndex, '/')}`,
          query: urlParams.toString(),
          scrollOptions,
        })
        return
      }

      urlParams.set('map', `${map},${facet.map}`)

      navigate({
        to: `/${query}/${facet.value}`,
        query: urlParams.toString(),
        scrollOptions,
      })
    },
    [map, navigate, query]
  )

  return navigateToFacet
}

export default useFacetNavigation
