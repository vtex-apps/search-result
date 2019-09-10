import React from 'react'
import { ExtensionPoint } from 'vtex.render-runtime'
import { path } from 'ramda'
import { Spinner } from 'vtex.styleguide'

import {
  useSearchPage,
  useSearchPageState,
} from 'vtex.search-page-context/SearchPageContext'

const SearchContent = () => {
  const { searchQuery, showFacets } = useSearchPage()
  const { mobileLayout, showContentLoader } = useSearchPageState()
  const products = path(['data', 'productSearch', 'products'], searchQuery)

  if (showContentLoader === undefined) {
    return null
  }

  if (showContentLoader) {
    return (
      <div className="w-100 flex justify-center">
        <div className="w3 ma0">
          <Spinner />
        </div>
      </div>
    )
  }
  if (!products || products.length === 0) {
    return <ExtensionPoint id="not-found" />
  }

  return (
    <ExtensionPoint
      id="gallery"
      products={products}
      className="bn"
      mobileLayoutMode={mobileLayout}
      showingFacets={showFacets}
    />
  )
}

export default SearchContent
