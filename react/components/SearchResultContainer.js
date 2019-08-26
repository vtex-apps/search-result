import React, { useState, useRef } from 'react'
import { min } from 'ramda'

import { Container } from 'vtex.store-components'

import { PopupProvider } from './Popup'
import InfiniteScrollLoaderResult from './loaders/InfiniteScrollLoaderResult'
import ShowMoreLoaderResult from './loaders/ShowMoreLoaderResult'
import { searchResultContainerPropTypes } from '../constants/propTypes'

const PAGINATION_TYPES = ['show-more', 'infinite-scroll']

/**
 * Search Result Container Component.
 */
const SearchResultContainer = props => {
  const {
    showMore = false,
    maxItemsPerPage = 10,
    searchQuery: {
      fetchMore,
      data: {
        facets: {
          brands = [],
          specificationFilters = [],
          priceRanges = [],
          categoriesTrees,
          recordsFiltered: facetRecordsFiltered,
        } = {},
        productSearch: { products = [], recordsFiltered, breadcrumb = [] } = {},
      } = {},
      loading,
      variables: { query },
    },
    pagination,
  } = props

  const [fetchMoreLoading, setFetchMoreLoading] = useState(false)

  const fetchMoreLocked = useRef(false)

  const handleFetchMore = () => {
    if (fetchMoreLocked.current || products.length === 0) {
      return
    }

    fetchMoreLocked.current = true

    const to = min(maxItemsPerPage + products.length, recordsFiltered) - 1

    setFetchMoreLoading(true)

    fetchMore({
      variables: {
        from: products.length,
        to,
      },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        setFetchMoreLoading(false)
        fetchMoreLocked.current = false

        // backwards compatibility
        if (prevResult.search) {
          return {
            search: {
              ...prevResult.search,
              products: [
                ...prevResult.search.products,
                ...fetchMoreResult.search.products,
              ],
            },
          }
        }

        return {
          ...prevResult,
          productSearch: {
            ...prevResult.productSearch,
            products: [
              ...prevResult.productSearch.products,
              ...fetchMoreResult.productSearch.products,
            ],
          },
        }
      },
    })
  }

  const ResultComponent =
    pagination === PAGINATION_TYPES[0]
      ? ShowMoreLoaderResult
      : InfiniteScrollLoaderResult

  return (
    <Container className="pt3-m pt5-l w-100">
      <PopupProvider>
        <div id="search-result-anchor" />
        <ResultComponent
          {...props}
          showMore={showMore}
          breadcrumbsProps={{ breadcrumb }}
          onFetchMore={handleFetchMore}
          fetchMoreLoading={fetchMoreLoading}
          query={query}
          loading={loading}
          recordsFiltered={recordsFiltered}
          facetRecordsFiltered={facetRecordsFiltered}
          products={products}
          brands={brands}
          specificationFilters={specificationFilters}
          priceRanges={priceRanges}
          tree={categoriesTrees}
        />
      </PopupProvider>
    </Container>
  )
}

SearchResultContainer.propTypes = searchResultContainerPropTypes

export default SearchResultContainer
