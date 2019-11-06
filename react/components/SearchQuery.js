import { path, zip, split, head, join, tail } from 'ramda'
import { useMemo, useRef } from 'react'
import { useQuery } from 'react-apollo'
import {
  productSearchV2 as productSearchQuery,
  searchMetadata as searchMetadataQuery,
  productSearchNoSimulations,
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

const SearchQuery = ({
  maxItemsPerPage,
  query,
  map,
  orderBy,
  priceRange,
  hideUnavailableItems,
  pageQuery,
  children,
  quickSearch,
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
      ...facetsArgs,
      skipBreadcrumbs: quickSearch,
    }
  }, [
    query,
    map,
    orderBy,
    priceRange,
    from,
    to,
    hideUnavailableItems,
    facetsArgs,
    quickSearch,
  ])
  const extraParams = useMemo(() => {
    return {
      ...variables,
      maxItemsPerPage,
      page,
    }
  }, [variables, maxItemsPerPage, page])

  const productSearchNoSimulationsResult = useQuery(
    productSearchNoSimulations,
    {
      ssr: false,
      variables,
      skip: !quickSearch,
    }
  )

  const productSearchResult = useQuery(productSearchQuery, {
    ssr: false,
    variables,
  })

  if (quickSearch && productSearchNoSimulationsResult.data) {
    productSearchResult.data.productSearch = {
      ...productSearchResult.data.productSearch,
      breadcrumb: path(
        ['data', 'productSearchNoSimulations', 'breadcrumb'],
        productSearchNoSimulationsResult
      ),
    }
  }

  const { data: { searchMetadata } = {} } = useQuery(searchMetadataQuery, {
    variables: {
      query: variables.query,
      map: variables.map,
    },
  })

  const searchInfo = useMemo(
    () => ({
      ...(productSearchResult || {}),
      ...(productSearchNoSimulationsResult || {}),
      data: {
        productSearch:
          path(['data', 'productSearch'], productSearchResult) ||
          path(['data', 'productSearchNoSimulations'], productSearchResult),
        facets: productSearchResult.data && productSearchResult.data.facets,
        searchMetadata,
      },
    }),
    [productSearchResult, searchMetadata, productSearchNoSimulationsResult]
  )

  return children(searchInfo, extraParams)
}

export default SearchQuery
