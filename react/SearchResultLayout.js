import React from 'react'
import { useChildBlock, ExtensionPoint } from 'vtex.render-runtime'
import { useDevice } from 'vtex.device-detector'
import { path, compose, equals, pathOr, isEmpty } from 'ramda'

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

const SearchResultLayout = props => {
  const { searchQuery } = props
  const hasMobileBlock = !!useChildBlock({ id: 'search-result-layout.mobile' })
  const hasCustomNotFound = !!useChildBlock({ id: 'not-found-layout' })
  const { isMobile } = useDevice()

  if (foundNothing(searchQuery) && hasCustomNotFound) {
    return <ExtensionPoint id="not-found-layout" {...props} />
  }

  if (hasMobileBlock && isMobile) {
    return <ExtensionPoint id="search-result-layout.mobile" {...props} />
  }

  return <ExtensionPoint id="search-result-layout.desktop" {...props} />
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
