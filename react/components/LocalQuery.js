import { path } from 'ramda'
import React from 'react'
import { useRuntime } from 'vtex.render-runtime'
import SearchQuery from './SearchQuery'

import { SORT_OPTIONS } from '../OrderBy'

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

  return (
    <SearchQuery
      maxItemsPerPage={maxItemsPerPage}
      query={queryField}
      map={map}
      orderBy={orderBy}
      priceRange={priceRange}
      hideUnavailableItems={hideUnavailableItems}
      pageQuery={pageQuery}
    >
      {(searchQuery, extraParams) => {
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
          page: extraParams.page,
          from: extraParams.from,
          to: extraParams.to,
          maxItemsPerPage,
        })
      }}
    </SearchQuery>
  )
}

export default LocalQuery
