import React from 'react'
import { path } from 'ramda'
import { FormattedMessage, defineMessages } from 'react-intl'

import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = ['showingProducts', 'showingProductsCount']

const showingAllProductsMessages = defineMessages({
  showingProducts: {
    id: 'store/search-result.showing-all-products',
  },
  showingProductsCount: {
    id: 'store/search-result.showing-all-products-count',
  },
})

const showingProductsMessages = defineMessages({
  showingProducts: {
    id: 'store/search-result.showing-products',
  },
  showingProductsCount: {
    id: 'store/search-result.showing-products-count',
  },
})

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

  const messages =
    products.length === recordsFiltered
      ? showingAllProductsMessages
      : showingProductsMessages

  return (
    <div
      className={`
        ${handles.showingProducts} tc t-small pt3 c-muted-2
      `}
    >
      <FormattedMessage
        id={messages.showingProducts.id}
        tagName="span"
        values={{
          value: (
            <span className={`${handles.showingProductsCount} b`}>
              <FormattedMessage
                id={messages.showingProductsCount.id}
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
