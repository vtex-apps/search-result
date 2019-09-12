import React from 'react'
import { Button } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'

import SearchResult from '../SearchResult'
import { loaderPropTypes } from '../../constants/propTypes'

import searchResult from '../../searchResult.css'

/**
 * Search Result Component.
 */
const ShowMoreLoaderResult = props => {
  const {
    products,
    recordsFiltered,
    onFetchMore,
    fetchMoreLoading,
    showProductsCount,
    children,
    to,
  } = props

  // If it has children, it is a flexible UI
  if (children) {
    return children
  }

  return (
    <SearchResult {...props}>
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
    </SearchResult>
  )
}

ShowMoreLoaderResult.propTypes = loaderPropTypes

export default ShowMoreLoaderResult
