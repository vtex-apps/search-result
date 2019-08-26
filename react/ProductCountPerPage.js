import React from 'react'
import { path } from 'ramda'
import { FormattedMessage } from 'react-intl'

import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'

import searchResult from './searchResult.css'

const ProductCountPerPage = () => {
  const { searchQuery } = useSearchPage()
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
    <div className={`${searchResult.showingProducts} tc t-small pt3 c-muted-2`}>
      <FormattedMessage
        id="store/search-result.showing-products"
        tagName="span"
        values={{
          value: (
            <span className={`${searchResult.showingProductsCount} b`}>
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
