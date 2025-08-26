// eslint-disable-next-line no-restricted-imports
import { zip } from 'ramda'
import { useCallback, useState } from 'react'
import { useRuntime } from 'vtex.render-runtime'
import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'

import { useFilterNavigator } from '../components/FilterNavigatorContext'
import { newFacetPathName } from '../utils/slug'
import { HEADER_SCROLL_OFFSET } from '../constants/SearchHelpers'
import {
  MAP_CATEGORY_CHAR,
  MAP_QUERY_KEY,
  MAP_VALUES_SEP,
  PATH_SEPARATOR,
  FULLTEXT_QUERY_KEY,
  SELLER_QUERY_KEY,
} from '../constants'
import useSearchState from './useSearchState'
import { getMainSearches } from '../utils/compatibilityLayer'

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
    .filter(mapItem => !mapsToFilter.includes(mapItem))
    .join(MAP_VALUES_SEP)
}

const getCleanUrlParams = currentMap => {
  const urlParams = new URLSearchParams(window.location.search)

  urlParams.set(MAP_QUERY_KEY, currentMap)
  if (!currentMap) {
    urlParams.delete(MAP_QUERY_KEY)
  }

  urlParams.delete('page')

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
      }

      upsert(selectedFacets, facet)

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
  fullTextSellerAndCollection,
  facets,
  selectedFacets,
  ignoreGlobalShipping,
  onShouldIgnore
) => {
  // RadioGroup behavior
  let shouldIgnore = ignoreGlobalShipping
  const selectedShippingFacet = facets.find(facet => facet.key === 'shipping')

  if (selectedShippingFacet && !selectedShippingFacet.selected) {
    selectedFacets = selectedFacets.filter(facet => facet.key !== 'shipping')
    shouldIgnore = false
    onShouldIgnore(false)
  } else if (selectedShippingFacet && selectedShippingFacet.selected) {
    shouldIgnore = true
    onShouldIgnore(true)
  }

  const querySegments = selectedFacets.map(facet => facet.value)
  const mapSegments = selectedFacets.map(facet => facet.map)

  if (shouldIgnore) {
    querySegments.push('ignore')
    mapSegments.push('shipping')
  }

  const { ft: fullText, seller } = fullTextSellerAndCollection

  if (fullText) {
    querySegments.push(fullText)
    mapSegments.push(FULLTEXT_QUERY_KEY)
  }

  if (seller && mapSegments.indexOf(SELLER_QUERY_KEY) === -1) {
    querySegments.push(seller)
    mapSegments.push(SELLER_QUERY_KEY)
  }

  return buildQueryAndMap(querySegments, mapSegments, facets, selectedFacets)
}

const useFacetNavigation = (selectedFacets, scrollToTop = 'none') => {
  const { navigate, setQuery, query: runtimeQuery } = useRuntime()
  const { map, query } = useFilterNavigator()
  const { fuzzy, operator, searchState } = useSearchState()
  const { searchQuery } = useSearchPage()
  const [ignoreGlobalShipping, setIgnoreGlobalShipping] = useState(false)
  const fullTextQuery = map.split(',').includes('ft')

  const mainSearches = getMainSearches(query, map)

  const navigateToFacet = useCallback(
    (
      maybeFacets,
      preventRouteChange = false,
      isReset = false,
      priceRange = undefined
    ) => {
      const facets = Array.isArray(maybeFacets) ? maybeFacets : [maybeFacets]
      const { query: currentQuery, map: currentMap } = buildNewQueryMap(
        mainSearches,
        facets,
        selectedFacets,
        ignoreGlobalShipping,
        should => setIgnoreGlobalShipping(should)
      )

      if (isReset) {
        setIgnoreGlobalShipping(false)
      }

      if (scrollToTop !== 'none') {
        window.scroll({ top: 0, left: 0, behavior: scrollToTop })
      }

      if (preventRouteChange) {
        const state =
          typeof sessionStorage !== 'undefined'
            ? sessionStorage.getItem('searchState') ?? searchState
            : searchState ?? undefined

        const queries = {
          ...(currentMap && { map: `${currentMap}` }),
          query: `/${isReset ? runtimeQuery.initialQuery : currentQuery}`,
          page: undefined,
          fuzzy: fullTextQuery ? fuzzy || undefined : undefined,
          operator: fullTextQuery ? operator || undefined : undefined,
          searchState: state,
          initialMap: runtimeQuery.initialMap ?? map,
          initialQuery: runtimeQuery.initialQuery ?? query,
          ...(isReset ? { priceRange: undefined } : { priceRange }),
        }

        setQuery(queries)

        return
      }

      let newQuery = replaceQueryForNewQueryFormat(currentQuery, currentMap, [
        ...selectedFacets,
        ...facets,
      ])

      const urlParams = getCleanUrlParams(
        removeMapForNewURLFormat(currentMap, [...selectedFacets, ...facets])
      )

      if (
        searchQuery?.variables &&
        (!urlParams.get('initialQuery') || !urlParams.get('initialMap'))
      ) {
        const { map: mapVariable, query: queryVariable } = searchQuery.variables

        urlParams.set('initialQuery', queryVariable)
        urlParams.set('initialMap', mapVariable)
      }

      if (fuzzy && fullTextQuery) {
        urlParams.set('fuzzy', fuzzy)
      }

      if (operator && fullTextQuery) {
        urlParams.set('operator', operator)
      }

      if (searchState) {
        urlParams.set(
          'searchState',
          sessionStorage.getItem('searchState') ?? searchState
        )
      }

      if (priceRange) {
        urlParams.set('priceRange', priceRange)
      }

      if (!newQuery || newQuery === 'ignore') {
        const { initialQuery, initialMap } = runtimeQuery

        if (!initialQuery || !initialMap) {
          return
        }

        newQuery = initialQuery
        urlParams.set('map', initialMap)
      }

      if (isReset) {
        urlParams.delete('priceRange')
      }

      navigate({
        to: `${PATH_SEPARATOR}${newQuery}`,
        query: urlParams.toString(),
        scrollOptions,
        modifiersOptions: {
          LOWERCASE: false,
        },
      })
    },
    [
      fullTextQuery,
      fuzzy,
      mainSearches,
      map,
      navigate,
      operator,
      query,
      runtimeQuery,
      scrollToTop,
      searchQuery,
      searchState,
      selectedFacets,
      setQuery,
      ignoreGlobalShipping,
    ]
  )

  return navigateToFacet
}

export default useFacetNavigation
