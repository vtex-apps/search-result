import React, { Component } from 'react'
import { Query } from 'react-apollo'
import { withRuntimeContext } from 'vtex.render-runtime'
import { Queries } from 'vtex.store-resources'

import { SORT_OPTIONS } from '../OrderBy'

const DEFAULT_PAGE = 1

class LocalQuery extends Component {
  static defaultProps = {
    orderByField: SORT_OPTIONS[0].value,
  }

  render() {
    const {
      maxItemsPerPage,
      queryField,
      mapField,
      orderByField,
      query: {
        order: orderBy = orderByField,
        page: pageQuery,
        priceRange,
        map = mapField,
      },
      runtime: { page: runtimePage },
    } = this.props

    const page = pageQuery ? parseInt(pageQuery) : DEFAULT_PAGE
    const from = (page - 1) * maxItemsPerPage
    const to = from + maxItemsPerPage - 1

    return (
      <Query
        query={Queries.search}
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

          return this.props.render({
            ...this.props,
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
}

export default withRuntimeContext(LocalQuery)
