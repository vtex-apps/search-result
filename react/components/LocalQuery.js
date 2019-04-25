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
      {searchQueryProps => {
        const { data } = searchQueryProps
        const { search } = data || {}

        return render({
          ...props,
          searchQuery: {
            ...searchQueryProps,
            ...search,
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
