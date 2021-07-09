import React from 'react'
import { useChildBlock, ExtensionPoint } from 'vtex.render-runtime'
import { useDevice } from 'vtex.device-detector'
import { path, compose, equals, pathOr, isEmpty, isNil } from 'ramda'

import OldSearchResult from './index'
import { removeTreePath } from './utils/removeTreePath'

const noProducts = compose(
  isEmpty,
  pathOr([], ['data', 'productSearch', 'products'])
)

const noRedirect = compose(isNil, path(['data', 'productSearch', 'redirect']))

const foundNothing = searchQuery => {
  const { loading } = searchQuery || {}
  return !loading && noProducts(searchQuery)
}

const SearchResultLayout = props => {
  const { searchQuery } = props
  const hasMobileBlock = !!useChildBlock({ id: 'search-result-layout.mobile' })
  const hasCustomNotFound = !!useChildBlock({ id: 'search-not-found-layout' })
  const { isMobile } = useDevice()

  if (
    foundNothing(searchQuery) &&
    hasCustomNotFound &&
    noRedirect(searchQuery)
  ) {
    return (
      <ExtensionPoint id="search-not-found-layout" {...removeTreePath(props)} />
    )
  }

  if (hasMobileBlock && isMobile) {
    return (
      <ExtensionPoint
        id="search-result-layout.mobile"
        {...removeTreePath(props)}
      />
    )
  }

  return (
    <ExtensionPoint
      id="search-result-layout.desktop"
      {...removeTreePath(props)}
    />
  )
}

SearchResultLayout.getSchema = () => {
  const { description, ...schema } = OldSearchResult.getSchema({
    searchQuery: true,
  })

  return {
    ...schema,
    title: 'admin/editor.search-result-layout.title',
  }
}

export default SearchResultLayout
