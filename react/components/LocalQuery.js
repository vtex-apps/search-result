import { identity } from 'ramda'
import React, { Component } from 'react'
import { Query } from 'react-apollo'
import { withRuntimeContext } from 'render'
import { Queries } from 'vtex.store'

const DEFAULT_PAGE = 1

function createInitialMap(params) {
  const map = [
    params.term && 'ft',
    params.brand && 'b',
    params.department && 'c',
    params.category && 'c',
    params.subcategory && 'c',
  ]

  return map.filter(identity).join(',')
}

class LocalQuery extends Component {
  render() {
    const {
      nextTreePath,
      params,
      maxItemsPerPage,
      queryField,
      mapField,
      restField,
      orderByField,
      query: {
        order: orderBy = orderByField,
        page: pageQuery,
        map: mapQuery,
        rest = '',
        priceRange,
      },
      runtime: { page: runtimePage },
    } = this.props

    const map = mapQuery || createInitialMap(params)
    const page = pageQuery ? parseInt(pageQuery) : DEFAULT_PAGE
    const from = (page - 1) * maxItemsPerPage
    const to = from + maxItemsPerPage - 1

    const defaultSearch = {
      query: Object.values(params)
        .filter(s => s.length > 0)
        .join('/'),
      map,
      rest,
      orderBy,
      priceRange,
      from,
      to,
    }

    const customSearch = {
      query: queryField,
      map: mapField,
      rest: restField,
      orderBy,
      priceRange,
      from,
      to,
    }

    return (
      <Query
        query={Queries.search}
        variables={queryField ? customSearch : defaultSearch}
        notifyOnNetworkStatusChange
      >
        {searchQueryProps => {
          const { data } = searchQueryProps
          const { search } = data || {}

          return this.props.render({
            ...this.props,
            searchQuery: {
              ...searchQueryProps,
              ...search,
            },
            searchContext: runtimePage,
            pagesPath: nextTreePath,
            map,
            rest,
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
}

export default withRuntimeContext(LocalQuery)
