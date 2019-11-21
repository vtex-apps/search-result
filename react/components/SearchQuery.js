import { path } from 'ramda'
import { useMemo, useRef, useCallback, useState, useEffect } from 'react'
import { useQuery } from 'react-apollo'
import {
  productSearchV2 as productSearchQuery,
  productSearchNoSimulations,
  searchMetadata as searchMetadataQuery,
  facets as facetsQuery,
} from 'vtex.store-resources/Queries'

const DEFAULT_PAGE = 1

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

const useProductQuery = (variables, usePublicSearch) => {
  const withSimulationDoneRef = useRef(false)
  const noSimulationDoneRef = useRef(false)
  const productsRef = useRef(undefined)
  const [finalProducts, setFinalProducts] = useState(undefined)

  useEffect(() => {
    if (variables) {
      noSimulationDoneRef.current = false
      withSimulationDoneRef.current = false
    }
  }, [variables])

  const productSearchResult = useQuery(productSearchQuery, {
    ssr: false,
    variables,
    onCompleted: data => {
      withSimulationDoneRef.current = true
      if (!noSimulationDoneRef.current) {
        productsRef.current = path(['productSearch', 'products'], data)
        setFinalProducts(productsRef.current)
        return
      }

      if (productsRef.current) {
        const products = productsRef.current
        const newProducts = data.productSearch && data.productSearch.products
        if (newProducts && products.length !== newProducts.length) {
          productsRef.current = newProducts
          setFinalProducts(productsRef.current)
          return
        }
        const areEqual = products.every(
          (p, i) => p.productId === newProducts[i].productId
        )
        if (!areEqual) {
          productsRef.current = newProducts
          setFinalProducts(productsRef.current)
          return
        }
        for (let i = 0; i < products.length; i++) {
          products[i] = { ...products[i] }

          products[i].priceRange = newProducts[i].priceRange
          products[i].items.forEach((item, itemIndex) => {
            if (item.itemId !== newProducts[i].items[itemIndex].itemId) {
              item = newProducts[i].items[itemIndex]
            } else {
              item.sellers.forEach((seller, sellerIndex) => {
                seller.commertialOffer =
                  newProducts[i].items[itemIndex].sellers[
                    sellerIndex
                  ].commertialOffer
              })
            }
          })
        }
        productsRef.current = products
        setFinalProducts([...productsRef.current])
      }
    },
  })

  const {
    data: noSimulationData = {},
    loading: noSimulationLoading,
  } = useQuery(productSearchNoSimulations, {
    ssr: false,
    variables: {
      query: variables.query,
      map: variables.map,
      orderBy: variables.orderBy,
      priceRange: variables.priceRange,
      from: variables.from,
      to: variables.to,
      hideUnavailableItems: variables.hideUnavailableItems,
      skusFilter: variables.skusFilter,
    },
    onCompleted: data => {
      noSimulationDoneRef.current = true
      if (!withSimulationDoneRef.current) {
        productsRef.current = path(
          ['productSearchNoSimulations', 'products'],
          data
        )
        setFinalProducts(productsRef.current)
      }
    },
    skip: !usePublicSearch,
  })

  const result = usePublicSearch
    ? {
        breadcrumb: path(
          ['productSearchNoSimulations', 'breadcrumb'],
          noSimulationData
        ),
        recordsFiltered: path(
          ['productSearchNoSimulations', 'recordsFiltered'],
          noSimulationData
        ),
        loading: noSimulationLoading,
        products: finalProducts,
      }
    : {
        breadcrumb: path(
          ['data', 'productSearch', 'breadcrumb'],
          productSearchResult
        ),
        recordsFiltered: path(
          ['data', 'productSearch', 'recordsFiltered'],
          productSearchResult
        ),
        loading: productSearchResult.loading,
        products: path(
          ['data', 'productSearch', 'products'],
          productSearchResult
        ),
      }

  return {
    ...result,
    productSearchResult,
  }
}

const useQueries = (variables, facetsArgs, usePublicSearch) => {
  const {
    breadcrumb,
    recordsFiltered,
    loading,
    productSearchResult,
    products,
  } = useProductQuery(variables, usePublicSearch)

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

  const refetch = useCombinedRefetch(productSearchResult.refetch, facetsRefetch)

  const data = {
    productSearch: {
      breadcrumb,
      recordsFiltered,
      products,
    },
    facets,
    searchMetadata,
  }

  return {
    loading,
    facetsLoading,
    data,
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
  skusFilter,
  children,
  usePublicSearch,
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
      hideUnavailableItems,
      withFacets: false,
      skusFilter,
      skipBreadcrumb: !!usePublicSearch,
    }
  }, [
    query,
    map,
    orderBy,
    priceRange,
    from,
    to,
    hideUnavailableItems,
    skusFilter,
    usePublicSearch,
  ])

  const {
    data,
    loading,
    refetch,
    productSearchResult,
    facetsLoading,
  } = useQueries(variables, facetsArgs, usePublicSearch)

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
