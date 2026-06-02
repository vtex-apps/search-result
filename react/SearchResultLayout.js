import React from 'react'
import { useChildBlock, ExtensionPoint, useRuntime } from 'vtex.render-runtime'
import { useDevice } from 'vtex.device-detector'
import { path, compose, equals, pathOr, isEmpty, isNil } from 'ramda'
import { useAds } from '@vtex/ads-react'

import OldSearchResult from './index'
import useMergeResults from './hooks/useMergeResults'
import { removeTreePath } from './utils/removeTreePath'

const noProducts = compose(
  isEmpty,
  pathOr([], ['data', 'productSearch', 'products'])
)

const isFtOnly = compose(equals('ft'), path(['variables', 'map']))

const noRedirect = compose(isNil, path(['data', 'productSearch', 'redirect']))

const foundNothing = searchQuery => {
  const { loading } = searchQuery || {}

  return isFtOnly(searchQuery) && !loading && noProducts(searchQuery)
}

const SearchResultLayout = props => {
  const { searchQuery } = props
  const hasMobileBlock = !!useChildBlock({ id: 'search-result-layout.mobile' })
  const hasCustomNotFound = !!useChildBlock({ id: 'search-not-found-layout' })
  const { isMobile } = useDevice()
  const { route } = useRuntime()

  const sponsoredSearchResult = useAds({
    placement: 'top_search',
    type: 'product',
    amount: props?.sponsoredCount ?? 3,
    term: searchQuery?.variables?.fullText ?? route?.params?.term,
    selectedFacets: searchQuery?.variables?.selectedFacets ?? [],
  })

  const newProps = useMergeResults({ props, sponsoredSearchResult })

  if (
    foundNothing(searchQuery) &&
    hasCustomNotFound &&
    noRedirect(searchQuery)
  ) {
    return (
      <ExtensionPoint
        id="search-not-found-layout"
        {...removeTreePath(newProps)}
      />
    )
  }

  if (hasMobileBlock && isMobile) {
    return (
      <ExtensionPoint
        id="search-result-layout.mobile"
        {...removeTreePath(newProps)}
      />
    )
  }

  return (
    <ExtensionPoint
      id="search-result-layout.desktop"
      {...removeTreePath(newProps)}
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
    properties: {
      ...schema?.properties,
      sponsoredCount: {
        type: 'number',
        title: 'Sponsored count',
        default: 3,
      },
    },
  }
}

export default SearchResultLayout
