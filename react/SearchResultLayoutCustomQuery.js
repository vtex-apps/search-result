import React from 'react'
import { useChildBlock, ExtensionPoint } from 'vtex.render-runtime'
import { useDevice } from 'vtex.device-detector'
import { path, compose, equals, pathOr, isEmpty } from 'ramda'

import LocalQuery from './components/LocalQuery'

import OldSearchResult from './index'

const noProducts = compose(
  isEmpty,
  pathOr([], ['data', 'productSearch', 'products'])
)

const isFtOnly = compose(
  equals('ft'),
  path(['variables', 'map'])
)

const foundNothing = searchQuery => {
  const { loading } = searchQuery || {}
  return isFtOnly(searchQuery) && !loading && noProducts(searchQuery)
}

const ExtensionPointWithProps = ({ id, parentProps, localSearchQueryData }) => (
  <ExtensionPoint
    id={id}
    {...parentProps}
    searchQuery={localSearchQueryData.searchQuery}
    maxItemsPerPage={localSearchQueryData.maxItemsPerPage}
    map={localSearchQueryData.map}
    params={localSearchQueryData.params}
    priceRange={localSearchQueryData.priceRange}
    orderBy={localSearchQueryData.orderBy}
  />
)

const SearchResultLayoutCustomQuery = props => {
  const hasMobileBlock = !!useChildBlock({ id: 'search-result-layout.mobile' })
  const hasCustomNotFound = !!useChildBlock({ id: 'not-found-layout' })
  const { isMobile } = useDevice()

  if (!props.querySchema) {
    // No valid Query schema provided!
    return null
  }

  return (
    <LocalQuery
      maxItemsPerPage={props.querySchema.maxItemsPerPage}
      queryField={props.querySchema.queryField}
      mapField={props.querySchema.mapField}
      orderByField={props.querySchema.orderByField}
      hideUnavailableItems={props.querySchema.hideUnavailableItems}
      query={props.query}
      render={localSearchQueryData => {
        if (
          foundNothing(localSearchQueryData.searchQuery) &&
          hasCustomNotFound
        ) {
          return (
            <ExtensionPointWithProps
              id="not-found-layout"
              parentProps={props}
              localSearchQueryData={localSearchQueryData}
            />
          )
        }
        if (hasMobileBlock && isMobile) {
          return (
            <ExtensionPointWithProps
              id="search-result-layout.mobile"
              parentProps={props}
              localSearchQueryData={localSearchQueryData}
            />
          )
        }
        return (
          <ExtensionPointWithProps
            id="search-result-layout.desktop"
            parentProps={props}
            localSearchQueryData={localSearchQueryData}
          />
        )
      }}
    />
  )
}

SearchResultLayoutCustomQuery.getSchema = () => {
  const { description, ...schema } = OldSearchResult.getSchema()
  return {
    ...schema,
    title: 'admin/editor.search-result-layout-custom.title',
  }
}

export default SearchResultLayoutCustomQuery
