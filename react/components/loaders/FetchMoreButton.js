import React, { Fragment, useState, useEffect } from 'react'
import { Button } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'

import searchResult from '../../searchResult.css'

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
  } = props
  const showButton = useShowButton(to, products, loading, recordsFiltered)

  return (
    <Fragment>
      <div
        className={`${searchResult.buttonShowMore} w-100 flex justify-center`}
      >
        {showButton && (
          <Button onClick={onFetchMore} isLoading={loading} size="small">
            <FormattedMessage id="store/search-result.show-more-button" />
          </Button>
        )}
      </div>
      {showProductsCount && recordsFiltered && (
        <div
          className={`${
            searchResult.showingProducts
          } tc t-small pt3 c-muted-2 mt2`}
        >
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
      )}
    </Fragment>
  )
}

export default FetchMoreButton
