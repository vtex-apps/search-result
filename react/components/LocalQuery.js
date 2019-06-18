import { path, zip, split, head, join, tail } from 'ramda'
import React, { useMemo } from 'react'
import { Query } from 'react-apollo'
import { useRuntime } from 'vtex.render-runtime'
import { productSearchV2 } from 'vtex.store-resources/Queries'

import { SORT_OPTIONS } from '../OrderBy'

const DEFAULT_PAGE = 1
const DEFAULT_MAX_ITEMS_PER_PAGE = 10

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
    const { finalMap, finalQuery } = relevantArgs.reduce(
      (accumulator, [tupleQuery, tupleMap]) => {
        accumulator.finalQuery.push(tupleQuery)
        accumulator.finalMap.push(tupleMap)
        return accumulator
      },
      { finalQuery: [], finalMap: [] }
    )
    const facetQuery = joinQuery(finalQuery)
    const facetMap = joinMap(finalMap)
    return {
      facetQuery,
      facetMap,
      withFacets: includeFacets(facetMap, facetQuery),
    }
  }, [map, query])
}

const LocalQuery = props => {
  const {
    maxItemsPerPage = DEFAULT_MAX_ITEMS_PER_PAGE,
    queryField = '',
    mapField = '',
    orderByField = SORT_OPTIONS[0].value,
    hideUnavailableItems,
    query: {
      order: orderBy = orderByField,
      page: pageQuery,
      priceRange,
      map = mapField,
    } = {},
    render,
  } = props

  const { page: runtimePage } = useRuntime()

  const page = pageQuery ? parseInt(pageQuery) : DEFAULT_PAGE
  const from = (page - 1) * maxItemsPerPage
  const to = from + maxItemsPerPage - 1
  const facetsArgs = useFacetsArgs(queryField, map)

  const variables = {
    query: queryField,
    map,
    orderBy,
    priceRange,
    from,
    to,
    hideUnavailableItems,
    ...facetsArgs,
  }

  return (
    <Query
      query={productSearchV2}
      variables={variables}
      notifyOnNetworkStatusChange
      partialRefetch
    >
      {searchQuery => {
        return render({
          ...props,
          searchQuery: {
            ...searchQuery,
            data: {
              ...(searchQuery.data || {}),
              products: path(
                ['data', 'productSearch', 'products'],
                searchQuery
              ),
            },
            // backwards-compatibility with search-result <= 3.13.x
            facets: path(['data', 'facets'], searchQuery),
            products: path(['data', 'products'], searchQuery),
            recordsFiltered: path(
              ['data', 'facets', 'recordsFiltered'],
              searchQuery
            ),
          },
          searchContext: runtimePage,
          pagesPath: runtimePage,
          map,
          orderBy,
          priceRange,
          page,
          from,
          to,
          maxItemsPerPage,
        })
      }}
    </Query>
  )
}

export default LocalQuery
