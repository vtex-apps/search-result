import React, { Fragment, useState, useEffect } from 'react'
import { Button } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'
import { FormattedMessage } from 'react-intl'

const CSS_HANDLES = [
  'buttonShowMore',
  'showingProducts',
  'showingProductsCount',
]

const useShowButton = (to, products, loading, recordsFiltered) => {
  const [showButton, setShowButton] = useState(
    !!products && to + 1 < recordsFiltered
  )
  useEffect(() => {
    if (!loading) {
      setShowButton(!!products && to + 1 < recordsFiltered)
    }
  }, [to, products, loading, recordsFiltered])

  return showButton
}

const FetchMoreButton = props => {
  const {
    products,
    to,
    recordsFiltered,
    onFetchMore,
    loading,
    showProductsCount,
    htmlElementForButton,
  } = props

  const isAnchor = htmlElementForButton === 'a'
  const showButton = useShowButton(to, products, loading, recordsFiltered)
  const handles = useCssHandles(CSS_HANDLES)

  const handleFetchMoreClick = ev => {
    isAnchor && ev.preventDefault()
    onFetchMore()
  }

  return (
    <Fragment>
      <div className={`${handles.buttonShowMore} w-100 flex justify-center`}>
        {showButton && (
          <Button
            onClick={ev => handleFetchMoreClick(ev)}
            href={isAnchor && '#'}
            rel={isAnchor && 'next'}
            isLoading={loading}
            size="small"
            key={to} // Necessary to prevent focus after click
          >
            <FormattedMessage id="store/search-result.show-more-button" />
          </Button>
        )}
      </div>
      {showProductsCount && recordsFiltered && (
        <div
          className={`${handles.showingProducts} tc t-small pt3 c-muted-2 mt2`}
        >
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
      )}
    </Fragment>
  )
}

export default FetchMoreButton
