import React, { useState, useRef } from 'react'
import { min } from 'ramda'

import { Container } from 'vtex.store-components'

import { PopupProvider } from './Popup'
import InfiniteScrollLoaderResult from './loaders/InfiniteScrollLoaderResult'
import ShowMoreLoaderResult from './loaders/ShowMoreLoaderResult'
import { searchResultContainerPropTypes } from '../constants/propTypes'

const PAGINATION_TYPES = ['show-more', 'infinite-scroll']

const getBreadcrumbsProps = ({
  category,
  department,
  term,
  categoriesTrees,
  loading,
}) => {
  const categoryReducer = (acc, category) => [...acc, `/${category.name}`]

  const categoryWithChildrenReducer = (acc, category) => [
    ...acc,
    `/${category.name}`,
    ...category.children.map(children => `/${category.name}/${children.name}`),
  ]

  let categories = []

  const params = {
    term: term ? decodeURIComponent(term) : term,
    categories,
  }

  if (loading && !categoriesTrees) {
    return params
  }

  if (department && category) {
    categories = categoriesTrees.reduce(categoryWithChildrenReducer, [])
  } else if (department) {
    categories = categoriesTrees.reduce(categoryReducer, [])
  }

  params.categories = categories

  return params
}

/**
 * Search Result Container Component.
 */
const SearchResultContainer = props => {
  const {
    params,
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
          recordsFiltered,
        } = {},
        products = [],
      } = {},
      loading,
      variables: { query },
    },
    pagination,
  } = props

  const [fetchMoreLoading, setFetchMoreLoading] = useState(false)

  const fetchMoreLocked = useRef(false)

  const handleFetchMore = () => {
    if (fetchMoreLocked.current) {
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
          products: [...prevResult.products, ...fetchMoreResult.products],
        }
      },
    })
  }

  const ResultComponent =
    pagination === PAGINATION_TYPES[0]
      ? ShowMoreLoaderResult
      : InfiniteScrollLoaderResult

  return (
    <Container className="pt3-m pt5-l">
      <PopupProvider>
        <div id="search-result-anchor" />
        <ResultComponent
          {...props}
          showMore={showMore}
          breadcrumbsProps={getBreadcrumbsProps(
            Object.assign({}, params, { categoriesTrees, loading })
          )}
          onFetchMore={handleFetchMore}
          fetchMoreLoading={fetchMoreLoading}
          query={query}
          loading={loading}
          recordsFiltered={recordsFiltered}
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
