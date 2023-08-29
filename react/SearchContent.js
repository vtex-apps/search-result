import { path } from 'ramda'
import React from 'react'
import { ExtensionPoint } from 'vtex.render-runtime'
import {
  useSearchPage,
  useSearchPageState,
} from 'vtex.search-page-context/SearchPageContext'

const SearchContent = () => {
  const { searchQuery, showFacets, lazyItemsRemaining } = useSearchPage()
  const { mobileLayout, showContentLoader } = useSearchPageState()

  const searchProducts =
    path(['data', 'productSearch', 'products'], searchQuery) || []

  const sponsoredProducts =
    path(['data', 'sponsoredProducts'], searchQuery) || []

  const products = sponsoredProducts.concat(searchProducts)

  const redirect = path(['data', 'productSearch', 'redirect'], searchQuery)

  /* No need to show the spinner if it is loading because
   the LoadingOverlay already takes care of this */
  if (showContentLoader === undefined || showContentLoader || redirect) {
    return null
  }

  if (!products || products.length === 0) {
    return <ExtensionPoint id="not-found" />
  }

  return (
    <>
      <ExtensionPoint
        id="gallery"
        products={products}
        className="bn"
        mobileLayoutMode={mobileLayout}
        showingFacets={showFacets}
        lazyItemsRemaining={lazyItemsRemaining}
      />
    </>
  )
}

export default SearchContent
