import { useMemo, useRef, useCallback, useEffect, useState } from 'react'
import { useQuery } from 'react-apollo'
import { useRuntime } from 'vtex.render-runtime'
import productSearchQuery from 'vtex.store-resources/QueryProductSearchV3'
import searchMetadataQuery from 'vtex.store-resources/QuerySearchMetadataV2'
import facetsQuery from 'vtex.store-resources/QueryFacetsV2'

import {
  buildSelectedFacetsAndFullText,
  detachFiltersByType,
  buildQueryArgsFromSelectedFacets,
} from '../utils/compatibilityLayer'
import { FACETS_RENDER_THRESHOLD } from '../constants/filterConstants'
import useRedirect from '../hooks/useRedirect'

const DEFAULT_PAGE = 1

const DEFAULT_QUERY_VALUES = {
  facetsBehavior: 'Static',
  installmentCriteria: 'MAX_WITHOUT_INTEREST',
  skusFilter: 'ALL_AVAILABLE',
  simulationBehavior: 'default',
}

// Has to match the value in the query middleware,
// in the vtex.render-server app.
// TODO: make these values sync somehow
const INITIAL_ITEMS_LIMIT = 18

const includeFacets = (map, query) =>
  !!(map && map.length > 0 && query && query.length > 0)

const useCombinedRefetch = (productRefetch, facetsRefetch) => {
  return useCallback(
    async (refetchVariables) => {
      let productVariables
      let facetsVariables

      if (refetchVariables) {
        const {
          query,
          map,
          priceRange,
          facetQuery,
          facetMap,
        } = refetchVariables

        productVariables = {
          ...refetchVariables,
          withFacets: false,
        }

        facetsVariables = {
          query: refetchVariables.facetQuery,
          map: refetchVariables.facetMap,
          hideUnavailableItems: refetchVariables.hideUnavailableItems,
          behavior: refetchVariables.facetsBehavior,
        }

        /* Some custom components may call the refetch function following the old protocol.
          This code guarantees that the refetchVariables  will follow the new search-protocol */
        if (query && map) {
          const [selectedFacets, fullText] = buildSelectedFacetsAndFullText(
            query,
            map,
            priceRange
          )

          productVariables = { ...productVariables, selectedFacets, fullText }
        }

        if (facetQuery && facetMap) {
          const [
            facetSelectedFacets,
            facetFullText,
          ] = buildSelectedFacetsAndFullText(facetQuery, facetMap, priceRange)

          facetsVariables = {
            ...facetsVariables,
            selectedFacets: facetSelectedFacets,
            fullText: facetFullText,
          }
        }
      }

      const [searchRefetchResult, facetsRefetchResult] = await Promise.all([
        productRefetch && productRefetch(productVariables),
        facetsRefetch && facetsRefetch(facetsVariables),
      ])

      return {
        ...searchRefetchResult,
        data: {
          ...(searchRefetchResult.data || {}),
          facets: facetsRefetchResult.data && facetsRefetchResult.data.facets,
        },
        errors: searchRefetchResult.errors || facetsRefetchResult.errors,
      }
    },
    [productRefetch, facetsRefetch]
  )
}

const isCurrentDifferent = (ref, currentVal) => ref.current !== currentVal

const useShouldResetPage = (query, map, orderBy) => {
  const queryRef = useRef(query)
  const mapRef = useRef(map)
  const orderByRef = useRef(orderBy)

  return (
    isCurrentDifferent(queryRef, query) ||
    isCurrentDifferent(mapRef, map) ||
    isCurrentDifferent(orderByRef, orderBy)
  )
}

const useCorrectPage = (page, shouldReset) => {
  const pageRef = useRef(page)

  if (shouldReset) {
    pageRef.current = DEFAULT_PAGE
  }

  return pageRef.current
}

const useCorrectSearchStateVariables = (
  fuzzy,
  operator,
  searchState,
  fullText
) => {
  const fullTextRef = useRef(fullText)
  const shouldReset = isCurrentDifferent(fullTextRef, fullText)

  const result = {
    fuzzy: shouldReset ? undefined : fuzzy,
    operator: shouldReset ? undefined : operator,
    searchState: shouldReset ? undefined : searchState,
  }

  fullTextRef.current = fullText

  return result
}

const useQueries = (variables, facetsArgs) => {
  const { getSettings } = useRuntime()
  const isLazyFacetsFetchEnabled = getSettings('vtex.store')
    ?.enableFiltersFetchOptimization

  const productSearchResult = useQuery(productSearchQuery, {
    variables,
  })

  const {
    refetch: searchRefetch,
    loading: searchLoading,
    fetchMore,
  } = productSearchResult

  const { data: { searchMetadata } = {} } = useQuery(searchMetadataQuery, {
    variables: {
      query: variables.query,
      fullText: variables.fullText,
      selectedFacets: variables.selectedFacets,
    },
  })

  const {
    data: { facets } = {},
    loading: facetsLoading,
    refetch: facetsRefetch,
    fetchMore: facetsFetchMore,
  } = useQuery(facetsQuery, {
    variables: {
      query: facetsArgs.facetQuery,
      map: facetsArgs.facetMap,
      from: isLazyFacetsFetchEnabled ? 0 : undefined,
      to: isLazyFacetsFetchEnabled ? FACETS_RENDER_THRESHOLD : undefined,
      fullText: variables.fullText,
      selectedFacets: variables.selectedFacets,
      hideUnavailableItems: variables.hideUnavailableItems,
      behavior: variables.facetsBehavior,
      categoryTreeBehavior: variables.categoryTreeBehavior,
      operator: variables.operator,
      fuzzy: variables.fuzzy,
      searchState: variables.searchState,
    },
    skip: !facetsArgs.withFacets,
  })

  const refetch = useCombinedRefetch(searchRefetch, facetsRefetch)

  const detachedFilters =
    facets && facets.facets
      ? detachFiltersByType(facets.facets)
      : {
          brands: [],
          brandsQuantity: 0,
          specificationFilters: [],
          categoriesTrees: [],
          priceRanges: [],
        }

  const selectedFacetsOutput =
    facets && facets.queryArgs && facets.queryArgs.selectedFacets

  const queryArgs =
    selectedFacetsOutput &&
    buildQueryArgsFromSelectedFacets(selectedFacetsOutput)

  const redirect =
    productSearchResult &&
    productSearchResult.data &&
    productSearchResult.data.productSearch &&
    productSearchResult.data.productSearch.redirect

  return {
    loading: searchLoading || redirect,
    facetsLoading,
    fetchMore,
    data: {
      productSearch:
        productSearchResult.data && productSearchResult.data.productSearch,
      facets: {
        ...detachedFilters,
        queryArgs,
        breadcrumb: facets && facets.breadcrumb,
        facetsFetchMore,
      },
      searchMetadata,
    },
    productSearchResult,
    refetch,
  }
}

const SearchQuery = ({
  maxItemsPerPage,
  query,
  map,
  orderBy,
  priceRange,
  hideUnavailableItems,
  facetsBehavior,
  categoryTreeBehavior,
  pageQuery,
  skusFilter,
  simulationBehavior,
  installmentCriteria,
  excludedPaymentSystems,
  includedPaymentSystems,
  children,
  operator: operatorQuery,
  fuzzy: fuzzyQuery,
  searchState: searchStateQuery,
  lazyItemsQuery: lazyItemsQueryProp,
  __unstableProductOriginVtex,
}) => {
  const [selectedFacets, fullText] = buildSelectedFacetsAndFullText(
    query,
    map,
    priceRange
  )

  const { getSettings } = useRuntime()
  const lazyItemsQuerySetting = getSettings('vtex.store')?.enableLazySearchQuery

  const shouldLimitItems =
    maxItemsPerPage > INITIAL_ITEMS_LIMIT &&
    // Prioritize the `lazyItemsQuery` prop if set, otherwise
    // uses the value from the `enableLazySearchQuery` setting
    (typeof lazyItemsQueryProp === 'boolean'
      ? lazyItemsQueryProp
      : lazyItemsQuerySetting)

  const itemsLimit = shouldLimitItems ? INITIAL_ITEMS_LIMIT : maxItemsPerPage

  /* This is the page of the first query since the component was rendered. 
  We want this behaviour so we can show the correct items even if the pageQuery
  changes. It should change only on a new render or if the query or orderby 
  change, hence the useCorrectPage that updates its value */
  const shouldReset = useShouldResetPage(query, map, orderBy)
  const page = useCorrectPage(
    pageQuery ? parseInt(pageQuery, 10) : DEFAULT_PAGE,
    shouldReset
  )

  const { fuzzy, operator, searchState } = useCorrectSearchStateVariables(
    fuzzyQuery,
    operatorQuery,
    searchStateQuery,
    fullText
  )

  const { setRedirect } = useRedirect()

  const from = (page - 1) * maxItemsPerPage
  const to = from + itemsLimit - 1

  const facetsArgs = {
    facetQuery: query,
    facetMap: map,
    withFacets: includeFacets(map, query),
  }

  const variables = useMemo(() => {
    return {
      map,
      query,
      orderBy,
      from,
      to,
      selectedFacets,
      fullText,
      operator,
      fuzzy,
      searchState,
      excludedPaymentSystems,
      includedPaymentSystems,
      productOriginVtex: !!__unstableProductOriginVtex,
      hideUnavailableItems: !!hideUnavailableItems,
      facetsBehavior: facetsBehavior || DEFAULT_QUERY_VALUES.facetsBehavior,
      categoryTreeBehavior,
      withFacets: false,
      skusFilter: skusFilter || DEFAULT_QUERY_VALUES.skusFilter,
      simulationBehavior:
        simulationBehavior || DEFAULT_QUERY_VALUES.simulationBehavior,
      installmentCriteria:
        installmentCriteria || DEFAULT_QUERY_VALUES.installmentCriteria,
    }
  }, [
    map,
    query,
    orderBy,
    from,
    to,
    hideUnavailableItems,
    facetsBehavior,
    categoryTreeBehavior,
    skusFilter,
    simulationBehavior,
    installmentCriteria,
    selectedFacets,
    fullText,
    operator,
    fuzzy,
    searchState,
    __unstableProductOriginVtex,
    excludedPaymentSystems,
    includedPaymentSystems,
  ])

  const {
    data,
    loading,
    refetch,
    productSearchResult,
    facetsLoading,
    fetchMore,
  } = useQueries(variables, facetsArgs)

  const redirectUrl = data && data.productSearch && data.productSearch.redirect

  useEffect(() => {
    setRedirect(redirectUrl)
  }, [redirectUrl, setRedirect])

  const isFetchingMore = useRef(false)
  const [lazyItemsRemaining, setLazyItemsRemaining] = useState(
    shouldLimitItems ? maxItemsPerPage - itemsLimit : 0
  )

  useEffect(() => {
    setLazyItemsRemaining(shouldLimitItems ? maxItemsPerPage - itemsLimit : 0)
  }, [map, query, from, shouldLimitItems, maxItemsPerPage, itemsLimit])

  useEffect(() => {
    if (!shouldLimitItems) {
      return
    }

    const fetchRemainingItems = () => {
      if (lazyItemsRemaining === 0 || isFetchingMore.current) {
        return
      }

      isFetchingMore.current = true

      fetchMore({
        variables: {
          from: from + INITIAL_ITEMS_LIMIT,
          to: from + maxItemsPerPage - 1,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          isFetchingMore.current = false
          setLazyItemsRemaining(0)

          return {
            ...prev,
            productSearch: {
              ...prev.productSearch,
              products: [
                ...prev.productSearch.products,
                ...fetchMoreResult.productSearch.products,
              ],
            },
          }
        },
      })
    }

    const timeout = setTimeout(() => {
      fetchRemainingItems()
    }, 500)

    return () => {
      clearTimeout(timeout)
    }
  }, [
    data,
    fetchMore,
    from,
    shouldLimitItems,
    maxItemsPerPage,
    lazyItemsRemaining,
    itemsLimit,
  ])

  const extraParams = useMemo(() => {
    return {
      ...variables,
      ...facetsArgs,
      maxItemsPerPage,
      lazyItemsRemaining,
      page,
      facetsLoading,
    }
  }, [
    variables,
    facetsArgs,
    maxItemsPerPage,
    lazyItemsRemaining,
    page,
    facetsLoading,
  ])

  const searchInfo = useMemo(
    () => ({
      ...(productSearchResult || {}),
      variables,
      data,
      loading,
      refetch,
    }),
    [data, loading, productSearchResult, refetch, variables]
  )

  return children(searchInfo, extraParams)
}

export default SearchQuery
