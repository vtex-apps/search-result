import { path, zip } from 'ramda'
import React from 'react'
import { Query } from 'react-apollo'
import { useRuntime } from 'vtex.render-runtime'
import { productSearchV2 } from 'vtex.store-resources/Queries'

import { SORT_OPTIONS } from '../OrderBy'

const DEFAULT_PAGE = 1
const DEFAULT_MAX_ITEMS_PER_PAGE = 10

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

  const { map: facetMap, query: facetQuery } = zip(
    queryField.split('/'),
    map.split(',')
  )
    .filter(([_, map]) => map === 'c' || map === 'ft')
    .reduce(
      ({ query: queryArr, map: mapArr }, [query, map]) => ({
        query: [...queryArr, query],
        map: [...mapArr, map],
      }),
      { map: [], query: [] }
    )

  const variables = {
    query: queryField,
    map,
    orderBy,
    priceRange,
    from,
    to,
    withFacets: !!(
      facetMap &&
      facetMap.length > 0 &&
      facetQuery &&
      facetQuery.length > 0
    ),
    facetQuery: facetQuery.join('/'),
    facetMap: facetMap.join(','),
    hideUnavailableItems,
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
