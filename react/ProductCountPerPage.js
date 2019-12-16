import React from 'react'
import { path } from 'ramda'
import { FormattedMessage } from 'react-intl'

import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = ['showingProducts', 'showingProductsCount']

const ProductCountPerPage = () => {
  const { searchQuery } = useSearchPage()
  const handles = useCssHandles(CSS_HANDLES)
  const products =
    path(['data', 'productSearch', 'products'], searchQuery) || []
  const recordsFiltered = path(
    ['data', 'productSearch', 'recordsFiltered'],
    searchQuery
  )

  if (products.length === 0) {
    return null
  }

  return (
    <div className={`${handles.showingProducts} tc t-small pt3 c-muted-2`}>
      <FormattedMessage
        id="store/search-result.showing-products"
        tagName="span"
        values={{
          value: (
            <span className={`${handles.showingProductsCount} b`}>
              <FormattedMessage
                id="store/search-result.showing-products-count"
                values={{
                  productsLoaded: products.length,
                  total: recordsFiltered,
                }}
              />
            </span>
          ),
        }}
      />
    </div>
  )
}

export default ProductCountPerPage
