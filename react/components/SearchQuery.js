import { useMemo, useRef, useCallback } from 'react'
import { useQuery } from 'react-apollo'
import {
  productSearchV2 as productSearchQuery,
  searchMetadata as searchMetadataQuery,
  facets as facetsQuery,
} from 'vtex.store-resources/Queries'

const DEFAULT_PAGE = 1
const DEFAULT_SKU_FILTER = 'ALL_AVAILABLE'

const includeFacets = (map, query) =>
  !!(map && map.length > 0 && query && query.length > 0)

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
                  behavior: refetchVariables.facetsBehavior,
                }
              : undefined
          ),
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
      behavior: variables.facetsBehavior,
    },
    skip: !facetsArgs.withFacets,
    ssr: false,
  })

  const refetch = useCombinedRefetch(searchRefetch, facetsRefetch)

  return {
    loading: searchLoading,
    facetsLoading,
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
  facetsBehavior,
  pageQuery,
  skusFilter,
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

  const facetsArgs = {
    facetQuery: query,
    facetMap: map,
    withFacets: includeFacets(map, query),
  }
  const variables = useMemo(() => {
    return {
      query,
      map,
      orderBy,
      priceRange,
      from,
      to,
      hideUnavailableItems: !!hideUnavailableItems,
      facetsBehavior: !!facetsBehavior,
      withFacets: false,
      skusFilter: skusFilter || DEFAULT_SKU_FILTER,
    }
  }, [
    query,
    map,
    orderBy,
    priceRange,
    from,
    to,
    hideUnavailableItems,
    facetsBehavior,
    skusFilter,
  ])

  const {
    data,
    loading,
    refetch,
    productSearchResult,
    facetsLoading,
  } = useQueries(variables, facetsArgs)

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
      data,
      loading,
      refetch,
    }),
    [data, loading, productSearchResult, refetch]
  )

  return children(searchInfo, extraParams)
}

export default SearchQuery
