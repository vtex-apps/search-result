import { path } from 'ramda'
import React from 'react'
import { Query } from 'react-apollo'
import { useRuntime } from 'vtex.render-runtime'
import { productSearch } from 'vtex.store-resources/Queries'

import { SORT_OPTIONS } from '../OrderBy'

const DEFAULT_PAGE = 1

const LocalQuery = props => {
  const {
    maxItemsPerPage,
    queryField,
    mapField,
    orderByField = SORT_OPTIONS[0].value,
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

  return (
    <Query
      query={productSearch}
      variables={{
        query: queryField,
        map,
        orderBy,
        priceRange,
        from,
        to,
        withFacets: !!(
          map &&
          map.length > 0 &&
          queryField &&
          queryField.length > 0
        ),
      }}
      notifyOnNetworkStatusChange
      partialRefetch
    >
      {searchQuery => {
        return render({
          ...props,
          searchQuery: {
            ...searchQuery,
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
        })
      }}
    </Query>
  )
}

export default LocalQuery
