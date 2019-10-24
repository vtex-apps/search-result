import { zip, split, head, join, tail } from 'ramda'
import { useMemo, useRef, useCallback } from 'react'
import { useQuery } from 'react-apollo'
import {
  productSearchV2 as productSearchQuery,
  searchMetadata as searchMetadataQuery,
  facets as facetsQuery,
} from 'vtex.store-resources/Queries'

const DEFAULT_PAGE = 1

const QUERY_SEPARATOR = '/'
const MAP_SEPARATOR = ','

const splitQuery = split(QUERY_SEPARATOR)
const splitMap = split(MAP_SEPARATOR)
const joinQuery = join(QUERY_SEPARATOR)
const joinMap = join(MAP_SEPARATOR)

const includeFacets = (map, query) =>
  !!(map && map.length > 0 && query && query.length > 0)

const useFacetsArgs = (query, map) => {
  return useMemo(() => {
    const queryArray = splitQuery(query)
    const mapArray = splitMap(map)
    const queryAndMap = zip(queryArray, mapArray)
    const relevantArgs = [
      head(queryAndMap),
      ...tail(queryAndMap).filter(
        ([_, tupleMap]) => tupleMap === 'c' || tupleMap === 'ft'
      ),
    ]
    const finalMap = []
    const finalQuery = []
    relevantArgs.forEach(([tupleQuery, tupleMap]) => {
      finalQuery.push(tupleQuery)
      finalMap.push(tupleMap)
    })
    const facetQuery = joinQuery(finalQuery)
    const facetMap = joinMap(finalMap)
    return {
      facetQuery,
      facetMap,
      withFacets: includeFacets(facetMap, facetQuery),
    }
  }, [map, query])
}

const useCombinedRefetch = (productRefetch, facetsRefetch) => {
  return useCallback(
    async refetchVariables => {
      const [searchRefetchResult, facetsRefetchResult] = await Promise.all([
        productRefetch &&
          productRefetch(
            refetchVariables
              ? {
                  ...refetchVariables,
                  withFacets: false,
                }
              : undefined
          ),
        facetsRefetch &&
          facetsRefetch(
            refetchVariables
              ? {
                  query: refetchVariables.facetQuery,
                  map: refetchVariables.facetMap,
                  hideUnavailableItems: refetchVariables.hideUnavailableItems,
                }
              : undefined
          ),
      ])
      return {
        ...searchRefetchResult,
        data: {
          ...searchRefetchResult.data,
          facets: facetsRefetchResult.data && facetsRefetchResult.data.facets,
        },
        errors: searchRefetchResult.errors || facetsRefetchResult.errors,
      }
    },
    [productRefetch, facetsRefetch]
  )
}

const useCorrectPage = ({ page, query, map, orderBy }) => {
  const pageRef = useRef(page)
  const queryRef = useRef(query)
  const mapRef = useRef(map)
  const orderByRef = useRef(orderBy)
  const isCurrentDifferent = (ref, currentVal) => ref.current !== currentVal
  if (
    isCurrentDifferent(queryRef, query) ||
    isCurrentDifferent(mapRef, map) ||
    isCurrentDifferent(orderByRef, orderBy)
  ) {
    pageRef.current = DEFAULT_PAGE
  }
  return pageRef.current
}

const useQueries = (variables, facetsArgs) => {
  const productSearchResult = useQuery(productSearchQuery, {
    ssr: false,
    variables,
  })
  const { refetch: searchRefetch, loading: searchLoading } = productSearchResult
  const { data: { searchMetadata } = {} } = useQuery(searchMetadataQuery, {
    variables: {
      query: variables.query,
      map: variables.map,
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
      hideUnavailableItems: variables.hideUnavailableItems,
    },
    skip: !facetsArgs.withFacets,
    ssr: false,
  })

  const refetch = useCombinedRefetch(searchRefetch, facetsRefetch)

  return {
    loading: searchLoading || facetsLoading,
    data: {
      productSearch:
        productSearchResult.data && productSearchResult.data.productSearch,
      facets,
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
  pageQuery,
  children,
}) => {
  /* This is the page of the first query since the component was rendered. 
  We want this behaviour so we can show the correct items even if the pageQuery
  changes. It should change only on a new render or if the query or orderby 
  change, hence the useCorrectPage that updates its value*/
  const page = useCorrectPage({
    page: pageQuery ? parseInt(pageQuery) : DEFAULT_PAGE,
    query,
    map,
    orderBy,
  })
  const from = (page - 1) * maxItemsPerPage
  const to = from + maxItemsPerPage - 1

  const facetsArgs = useFacetsArgs(query, map)
  const variables = useMemo(() => {
    return {
      query,
      map,
      orderBy,
      priceRange,
      from,
      to,
      hideUnavailableItems,
      withFacets: false,
    }
  }, [query, map, orderBy, priceRange, from, to, hideUnavailableItems])
  const extraParams = useMemo(() => {
    return {
      ...variables,
      ...facetsArgs,
      maxItemsPerPage,
      page,
    }
  }, [variables, facetsArgs, maxItemsPerPage, page])

  const { data, loading, refetch, productSearchResult } = useQueries(
    variables,
    facetsArgs
  )

  const searchInfo = useMemo(
    () => ({
      ...(productSearchResult || {}),
      data,
      loading,
      refetch,
    }),
    [data, loading, productSearchResult, refetch]
  )

  return children(searchInfo, extraParams)
}

export default SearchQuery
