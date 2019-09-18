import React, { Fragment } from 'react'
import { Button } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'

import searchResult from '../../searchResult.css'

const FetchMoreButton = props => {
  const {
    products,
    to,
    recordsFiltered,
    onFetchMore,
    fetchMoreLoading,
    showProductsCount,
  } = props

  return (
    <Fragment>
      <div
        className={`${searchResult.buttonShowMore} w-100 flex justify-center`}
      >
        {!!products && to + 1 < recordsFiltered && (
          <Button
            onClick={onFetchMore}
            isLoading={fetchMoreLoading}
            size="small"
          >
            <FormattedMessage id="store/search-result.show-more-button" />
          </Button>
        )}
      </div>
      {showProductsCount && (
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
