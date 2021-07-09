import React from 'react'
import { useChildBlock, ExtensionPoint, useRuntime } from 'vtex.render-runtime'
import { useDevice } from 'vtex.device-detector'
import { path, compose, equals, pathOr, isEmpty } from 'ramda'

import LocalQuery from './components/LocalQuery'

import OldSearchResult from './index'
import { removeTreePath } from './utils/removeTreePath'

const noProducts = compose(
  isEmpty,
  pathOr([], ['data', 'productSearch', 'products'])
)

const trimStartingSlash = value => value && value.replace(/^\//, '')

const foundNothing = searchQuery => {
  const { loading } = searchQuery || {}
  return !loading && noProducts(searchQuery)
}

const ExtensionPointWithProps = ({ id, parentProps, localSearchQueryData }) => {
  return (
    <ExtensionPoint
      id={id}
      {...removeTreePath(parentProps)}
      searchQuery={localSearchQueryData.searchQuery}
      maxItemsPerPage={localSearchQueryData.maxItemsPerPage}
      map={localSearchQueryData.map}
      params={localSearchQueryData.params}
      priceRange={localSearchQueryData.priceRange}
      orderBy={localSearchQueryData.orderBy}
      page={localSearchQueryData.page}
    />
  )
}

const SearchResultLayoutCustomQuery = props => {
  const hasMobileBlock = !!useChildBlock({ id: 'search-result-layout.mobile' })
  const hasCustomNotFound = !!useChildBlock({ id: 'search-not-found-layout' })
  const { isMobile } = useDevice()
  const { query } = useRuntime()

  const fieldsFromQueryString = {
    mapField: query.map,
    queryField: trimStartingSlash(query.query),
  }

  const areFieldsFromQueryStringValid = !!(
    fieldsFromQueryString.mapField && fieldsFromQueryString.queryField
  )

  if (!props.querySchema) {
    // No valid Query schema provided!
    return null
  }

  return (
    <LocalQuery
      maxItemsPerPage={props.querySchema.maxItemsPerPage}
      {...(areFieldsFromQueryStringValid
        ? fieldsFromQueryString
        : {
            queryField: props.querySchema.queryField,
            mapField: props.querySchema.mapField,
          })}
      orderByField={props.querySchema.orderByField}
      hideUnavailableItems={props.querySchema.hideUnavailableItems}
      facetsBehavior={props.querySchema.facetsBehavior}
      skusFilter={props.querySchema.skusFilter}
      query={props.query}
      __unstableProductOriginVtex={
        props.querySchema.__unstableProductOriginVtex
      }
      render={localSearchQueryData => {
        if (
          foundNothing(localSearchQueryData.searchQuery) &&
          hasCustomNotFound
        ) {
          return (
            <ExtensionPointWithProps
              id="search-not-found-layout"
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
        if (areFieldsFromQueryStringValid) {
          return (
            <ExtensionPointWithProps
              id="search-result-layout.desktop"
              parentProps={{
                ...props,
                querySchema: {
                  ...props.querySchema,
                  ...fieldsFromQueryString,
                },
              }}
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
  const { description, ...schema } = OldSearchResult.getSchema({})
  return {
    ...schema,
    title: 'admin/editor.search-result-layout-custom.title',
  }
}

export default SearchResultLayoutCustomQuery
