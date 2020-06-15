import { useMemo, useRef, useCallback, useEffect } from 'react'
import { useQuery } from 'react-apollo'
import { path } from 'ramda'

import productSearchQuery from 'vtex.store-resources/QueryProductSearchV3'
import searchMetadataQuery from 'vtex.store-resources/QuerySearchMetadataV2'
import facetsQuery from 'vtex.store-resources/QueryFacetsV2'

import {
  buildSelectedFacetsAndFullText,
  detachFiltersByType,
  buildQueryArgsFromSelectedFacets,
} from '../utils/compatibilityLayer'
import useRedirect from '../hooks/useRedirect'

const DEFAULT_PAGE = 1

const DEFAULT_QUERY_VALUES = {
  facetsBehavior: 'Static',
  installmentCriteria: 'MAX_WITHOUT_INTEREST',
  skusFilter: 'ALL_AVAILABLE',
  simulationBehavior: 'default',
}

const includeFacets = (map, query) =>
  !!(map && map.length > 0 && query && query.length > 0)

const useCombinedRefetch = (productRefetch, facetsRefetch) => {
  return useCallback(
    async refetchVariables => {
      let productVariables, facetsVariables

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
  shouldReset
) => {
  const fuzzyRef = useRef(fuzzy)
  const operatorRef = useRef(operator)
  const searchStateRef = useRef(searchState)

  if (shouldReset) {
    fuzzyRef.current = undefined
    operatorRef.current = undefined
    searchStateRef.current = undefined
  }

  return {
    fuzzy: fuzzyRef.current,
    operator: operatorRef.current,
    searchState: searchStateRef.current,
  }
}

const useQueries = (variables, facetsArgs) => {
  const productSearchResult = useQuery(productSearchQuery, {
    variables,
  })
  const { refetch: searchRefetch, loading: searchLoading } = productSearchResult
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
  } = useQuery(facetsQuery, {
    variables: {
      query: facetsArgs.facetQuery,
      map: facetsArgs.facetMap,
      fullText: variables.fullText,
      selectedFacets: variables.selectedFacets,
      hideUnavailableItems: variables.hideUnavailableItems,
      behavior: variables.facetsBehavior,
      operator: variables.operator,
      fuzzy: variables.fuzzy,
      searchState: variables.searchState,
    },
    skip: !facetsArgs.withFacets,
  })

  const refetch = useCombinedRefetch(searchRefetch, facetsRefetch)

  const detatachedFilters =
    facets && facets.facets
      ? detachFiltersByType(facets.facets)
      : {
          brands: [],
          specificationFilters: [],
          categoriesTrees: [],
          priceRanges: [],
        }

  const selectedFacetsOutput = path(['queryArgs', 'selectedFacets'], facets)
  const queryArgs =
    selectedFacetsOutput &&
    buildQueryArgsFromSelectedFacets(selectedFacetsOutput)

  const redirect = path(
    ['data', 'productSearch', 'redirect'],
    productSearchResult
  )

  return {
    loading: searchLoading || redirect,
    facetsLoading,
    data: {
      productSearch:
        productSearchResult.data && productSearchResult.data.productSearch,
      facets: {
        ...detatachedFilters,
        queryArgs,
        breadcrumb: facets && facets.breadcrumb,
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
  pageQuery,
  skusFilter,
  simulationBehavior,
  installmentCriteria,
  children,
  operator: operatorQuery,
  fuzzy: fuzzyQuery,
  searchState: searchStateQuery,
  __unstableProductOriginVtex,
}) => {
  /* This is the page of the first query since the component was rendered. 
  We want this behaviour so we can show the correct items even if the pageQuery
  changes. It should change only on a new render or if the query or orderby 
  change, hence the useCorrectPage that updates its value*/
  const shouldReset = useShouldResetPage(query, map, orderBy)
  const page = useCorrectPage(
    pageQuery ? parseInt(pageQuery) : DEFAULT_PAGE,
    shouldReset
  )
  const { fuzzy, operator, searchState } = useCorrectSearchStateVariables(
    fuzzyQuery,
    operatorQuery,
    searchStateQuery,
    shouldReset
  )
  const { setRedirect } = useRedirect()

  const from = (page - 1) * maxItemsPerPage
  const to = from + maxItemsPerPage - 1

  const facetsArgs = {
    facetQuery: query,
    facetMap: map,
    withFacets: includeFacets(map, query),
  }

  const [selectedFacets, fullText] = buildSelectedFacetsAndFullText(
    query,
    map,
    priceRange
  )

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
      productOriginVtex: !!__unstableProductOriginVtex,
      hideUnavailableItems: !!hideUnavailableItems,
      facetsBehavior: facetsBehavior || DEFAULT_QUERY_VALUES.facetsBehavior,
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
    skusFilter,
    simulationBehavior,
    installmentCriteria,
    selectedFacets,
    fullText,
    operator,
    fuzzy,
    searchState,
    __unstableProductOriginVtex,
  ])

  const {
    data,
    loading,
    refetch,
    productSearchResult,
    facetsLoading,
  } = useQueries(variables, facetsArgs)

  const redirectUrl = path(['productSearch', 'redirect'], data)

  useEffect(() => {
    setRedirect(redirectUrl)
  }, [redirectUrl, setRedirect])

  const extraParams = useMemo(() => {
    return {
      ...variables,
      ...facetsArgs,
      maxItemsPerPage,
      page,
      facetsLoading,
    }
  }, [variables, facetsArgs, maxItemsPerPage, page, facetsLoading])

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
