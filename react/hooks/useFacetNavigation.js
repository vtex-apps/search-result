// eslint-disable-next-line no-restricted-imports
import { zip } from 'ramda'
import { useCallback, useState } from 'react'
import { useRuntime } from 'vtex.render-runtime'
import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'

import {
  isSingleOptionFilter,
  isRadioFilter,
  isToggleFilter,
} from '../constants/filterTypes'
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

/**
 * Removes other facets from the same group (key) from selectedFacets
 */
const removeOtherFacetsFromSameGroup = (selectedFacets, facetKey) => {
  return selectedFacets.filter(selectedFacet => selectedFacet.key !== facetKey)
}

/**
 * Removes a specific facet from selectedFacets by value and map
 */
const removeSpecificFacet = (selectedFacets, facetValue, facetMap) => {
  return selectedFacets.filter(
    selectedFacet =>
      selectedFacet.value !== facetValue && selectedFacet.map !== facetMap
  )
}

/**
 * Finds indices in query/map that match facets from the same group
 */
const findIndicesOfSameGroupFacets = (query, map, facet) => {
  const indicesToRemove = []

  zip(query, map).forEach(([value, valueMap], index) => {
    const existingFacet = { value, map: valueMap, key: facet.key }

    if (
      compareFacetWithQueryValues(value, valueMap, existingFacet) &&
      valueMap === facet.map
    ) {
      indicesToRemove.push(index)
    }
  })

  return indicesToRemove
}

/**
 * Removes multiple indices from query and map arrays
 */
const removeMultipleIndices = (query, map, indices) => {
  let updatedQuery = query
  let updatedMap = map

  // Remove in descending order to avoid affecting subsequent indices
  indices.reverse().forEach(index => {
    updatedQuery = removeElementAtIndex(updatedQuery, index)
    updatedMap = removeElementAtIndex(updatedMap, index)
  })

  return { query: updatedQuery, map: updatedMap }
}

/**
 * Finds the index of a specific facet in query/map
 */
const findFacetIndex = (query, map, facet) => {
  return zip(query, map).findIndex(([value, valueMap]) =>
    compareFacetWithQueryValues(value, valueMap, facet)
  )
}

/**
 * Generic handler for facet selection (adding to URL)
 * Handles both toggle and radio filters with their specific exclusion logic
 */
const handleFacetSelection = (query, map, facet, selectedFacets) => {
  const isToggle = isToggleFilter(facet.key)
  const isRadio = isRadioFilter(facet.key)

  // Remove other facets from the same group for exclusive filters (toggle/radio)
  let updatedSelectedFacets = selectedFacets
  let updatedQuery = query
  let updatedMap = map

  if (isToggle || isRadio) {
    // Remove other facets from the same group
    updatedSelectedFacets = removeOtherFacetsFromSameGroup(
      selectedFacets,
      facet.key
    )

    // Remove indices from query/map
    if (isToggle) {
      // Toggle: remove multiple indices (all from same group)
      const indicesToRemove = findIndicesOfSameGroupFacets(query, map, facet)
      const result = removeMultipleIndices(query, map, indicesToRemove)

      updatedQuery = result.query
      updatedMap = result.map
    }
    // Radio doesn't remove from query/map during selection, only during deselection
  }

  // Add the new selected facet
  upsert(updatedSelectedFacets, facet)

  return {
    query: updatedQuery,
    map: updatedMap,
    selectedFacets: updatedSelectedFacets,
  }
}

/**
 * Generic handler for facet deselection (removing from URL)
 */
const handleFacetDeselection = (query, map, facet, selectedFacets) => {
  const isRadio = isRadioFilter(facet.key)

  // Remove facet from selectedFacets
  const updatedSelectedFacets = isRadio
    ? removeOtherFacetsFromSameGroup(selectedFacets, facet.key)
    : removeSpecificFacet(selectedFacets, facet.value, facet.map)

  // Find and remove from query/map
  const facetIndex = findFacetIndex(query, map, facet)

  return {
    query: removeElementAtIndex(query, facetIndex),
    map: removeElementAtIndex(map, facetIndex),
    selectedFacets: updatedSelectedFacets,
  }
}

// eslint-disable-next-line max-params
const buildQueryAndMap = (
  querySegments,
  mapSegments,
  facets,
  selectedFacets
) => {
  const queryAndMap = facets.reduce(
    // eslint-disable-next-line max-params
    // The spread on facet is important so we can assign facet.newQuerySegment
    ({ query, map }, { ...facet }) => {
      const facetValue = facet.value
      const isToggle = isToggleFilter(facet.key)

      facet.newQuerySegment = newFacetPathName(facet)

      // Handle deselection for toggle filters (selected=false means removing from URL)
      if (isToggle && !facet.selected) {
        return handleFacetDeselection(query, map, facet, selectedFacets)
      }

      // Handle deselection for radio/other filters (selected=true means removing from URL)
      if (!isToggle && facet.selected) {
        return handleFacetDeselection(query, map, facet, selectedFacets)
      }

      // Handle selection for toggle filters (selected=true means adding to URL)
      if (isToggle && facet.selected) {
        const result = handleFacetSelection(query, map, facet, selectedFacets)

        query = result.query
        map = result.map
        selectedFacets = result.selectedFacets
      } else if (!isToggle && !facet.selected) {
        // Handle selection for radio/other filters (selected=false or undefined means adding to URL)
        upsert(selectedFacets, facet)
      }

      // Handle category positioning when category needs insertion in the middle
      if (facet.map === MAP_CATEGORY_CHAR) {
        const lastCategoryIndex = map.lastIndexOf(MAP_CATEGORY_CHAR)

        if (lastCategoryIndex >= 0 && lastCategoryIndex !== map.length - 1) {
          // Corner case: if we are adding a category but there are other filters other than category applied.
          // Add the new category filter to the right of the other categories.
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

      // Default: append to the end
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

// eslint-disable-next-line max-params
export const buildNewQueryMap = (
  fullTextSellerAndCollection,
  facets,
  selectedFacets,
  ignoreGlobalShipping,
  onShouldIgnore
) => {
  // RadioGroup behavior - only apply radio logic when radio filters are actually involved
  let shouldIgnore = ignoreGlobalShipping
  const selectedShippingFacet = facets?.find(facet =>
    isSingleOptionFilter(facet.key)
  )

  // Handle single option filters (radio and toggle) with unified logic
  if (selectedShippingFacet) {
    if (!selectedShippingFacet.selected) {
      // Remove only single option filters of the same key/type when deselecting
      selectedFacets = selectedFacets.filter(
        facet => facet.key !== selectedShippingFacet.key
      )
      shouldIgnore = false
      onShouldIgnore(false)
    } else {
      // Only radio filters use the "ignore" URL pattern
      // Toggle filters are included normally in the URL
      shouldIgnore = isRadioFilter(selectedShippingFacet.key)
      onShouldIgnore(shouldIgnore)
    }
  } else {
    // No single option filters involved - reset shouldIgnore
    shouldIgnore = false
    onShouldIgnore(false)
  }

  const querySegments = selectedFacets.map(facet => facet.value)
  const mapSegments = selectedFacets.map(facet => facet.map)
  const shouldAddIgnoreSegment = shouldIgnore && selectedShippingFacet

  if (shouldAddIgnoreSegment) {
    querySegments.push('ignore')
    mapSegments.push(selectedShippingFacet.key)
  }

  const { ft: fullText, seller } = fullTextSellerAndCollection || {}
  const hasFullTextSearch = typeof fullText === 'string' && fullText.length > 0

  if (hasFullTextSearch) {
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
    // eslint-disable-next-line max-params
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
