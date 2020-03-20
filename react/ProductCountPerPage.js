import React from 'react'
import { path } from 'ramda'
import { FormattedMessage } from 'react-intl'

import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = [
  'showingProducts',
  'showingProductsCount',
  'showingProductsContainer',
  'showingAllProductsCount',
  'progressBar',
  'progressBarFiller',
]

const ProductCountPerPage = props => {
  const { showProductCountProgressBar = 'hidden' } = props
  const { searchQuery } = useSearchPage()

  const handles = useCssHandles(CSS_HANDLES)
  const products =
    path(['data', 'productSearch', 'products'], searchQuery) || []
  const recordsFiltered = path(
    ['data', 'productSearch', 'recordsFiltered'],
    searchQuery
  )

  const productsLoadedPercentage = Math.round(
    (100 * products.length) / recordsFiltered
  )
  if (products.length === 0) {
    return null
  }

  const showingProducts =
    productsLoadedPercentage !== 100
      ? {
          showingProductsId: 'store/search-result.showing-products',
          showingProductsCountId: 'store/search-result.showing-products-count',
        }
      : {
          showingProductsId: 'store/search-result.showing-all-products',
          showingProductsCountId:
            'store/search-result.showing-all-products-count',
        }

  return (
    <div
      className={`${handles.showingProductsContainer} flex flex-column justify-center items-center`}
    >
      <div
        className={`
        ${handles.showingProducts} tc t-small pt3 c-muted-2
      `}
      >
        <FormattedMessage
          id={showingProducts.showingProductsId}
          tagName="span"
          values={{
            value: (
              <span className={`${handles.showingProductsCount} b`}>
                <FormattedMessage
                  id={showingProducts.showingProductsCountId}
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
      {showProductCountProgressBar === 'show' && productsLoadedPercentage && (
        <div
          className={`${handles.progressBar} relative flex bg-action-secondary items-center mt4 br-pill w-50 h1`}
        >
          <span
            className={`${handles.progressBarFiller} absolute br-pill bg-action-primary h1`}
            style={{ width: `${productsLoadedPercentage}%` }}
          />
        </div>
      )}
    </div>
  )
}

export default ProductCountPerPage
