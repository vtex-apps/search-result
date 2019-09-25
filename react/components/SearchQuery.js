import { zip, split, head, join, tail } from 'ramda'
import React, { useMemo, useRef, useEffect } from 'react'
import { graphql, compose } from 'react-apollo'
import {
  productSearchV2 as productSearch,
  searchMetadata,
} from 'vtex.store-resources/Queries'

const DEFAULT_PAGE = 1

const QUERY_SEPARATOR = '/'
const MAP_SEPARATOR = ','

const splitQuery = split(QUERY_SEPARATOR)
const splitMap = split(MAP_SEPARATOR)
const joinQuery = join(QUERY_SEPARATOR)
const joinMap = join(MAP_SEPARATOR)

const ParallelQueries = ({
  children,
  extraParams,
  productSearch,
  searchMetadata,
}) => {
  // We need to do this to keep the same format as when we were using the Query component.
  const searchInfo = useMemo(
    () => ({
      ...(productSearch || {}),
      data: {
        productSearch: productSearch && productSearch.productSearch,
        facets: productSearch && productSearch.facets,
        searchMetadata: searchMetadata && searchMetadata.searchMetadata,
      },
    }),
    [productSearch, searchMetadata]
  )
  return children(searchInfo, extraParams)
}

const productSearchHOC = graphql(productSearch, {
  name: 'productSearch',
  options: props => ({
    variables: props.variables,
    ssr: false,
  }),
})

const searchMetadataHOC = graphql(searchMetadata, {
  name: 'searchMetadata',
  options: props => ({
    variables: { query: props.variables.query, map: props.variables.map },
  }),
})

const EnhancedParallelQueries = compose(
  productSearchHOC,
  searchMetadataHOC
)(ParallelQueries)

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
  changes. It should change only on a new render or if the query or orderby method 
  change, hence the useEffect that updates its value*/
  const page = useRef(pageQuery ? parseInt(pageQuery) : DEFAULT_PAGE)
  useEffect(() => {
    page.current = DEFAULT_PAGE
  }, [map, query, orderBy])

  const from = (page.current - 1) * maxItemsPerPage
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
  ])
  const extraParams = useMemo(() => {
    return {
      ...variables,
      maxItemsPerPage,
      page: page.current,
    }
  }, [variables, maxItemsPerPage, page])

  return (
    <EnhancedParallelQueries variables={variables} extraParams={extraParams}>
      {children}
    </EnhancedParallelQueries>
  )
}

export default SearchQuery
