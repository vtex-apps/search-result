import React, { useState, useRef } from 'react'
import { min } from 'ramda'

import { Container } from 'vtex.store-components'

import { PopupProvider } from './Popup'
import InfiniteScrollLoaderResult from './loaders/InfiniteScrollLoaderResult'
import ShowMoreLoaderResult from './loaders/ShowMoreLoaderResult'
import { searchResultContainerPropTypes } from '../constants/propTypes'

const PAGINATION_TYPES = ['show-more', 'infinite-scroll']

const getBreadcrumbsProps = ({ category, department, term, facets }) => {
  const categoriesTrees = facets ? facets.CategoriesTrees : []

  const categoryReducer = (acc, category) => [...acc, `/${category.Name}`]

  const categoryWithChildrenReducer = (acc, category) => [
    ...acc,
    `/${category.Name}`,
    ...category.Children.map(children => `/${category.Name}/${children.Name}`),
  ]

  const getCategoryList = (reducer, initial = []) =>
    categoriesTrees.reduce(reducer, initial)

  const categories =
    department && category
      ? getCategoryList(categoryWithChildrenReducer)
      : department
      ? getCategoryList(categoryReducer)
      : []

  return {
    term: term ? decodeURIComponent(term) : term,
    categories,
  }
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
          Brands = [],
          SpecificationFilters = [],
          PriceRanges = [],
          CategoriesTrees,
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

    const to = min(maxItemsPerPage + products.length, 0) - 1

    setFetchMoreLoading(true)

    fetchMore({
      variables: {
        from: products.length,
        to,
      },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        setFetchMoreLoading(false)
        fetchMoreLocked.current = false

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
            Object.assign({}, params, { facets: { CategoriesTrees } })
          )}
          onFetchMore={handleFetchMore}
          fetchMoreLoading={fetchMoreLoading}
          query={query}
          loading={loading}
          recordsFiltered={0}
          products={products}
          brands={Brands}
          specificationFilters={SpecificationFilters}
          priceRanges={PriceRanges}
          tree={CategoriesTrees}
        />
      </PopupProvider>
    </Container>
  )
}

SearchResultContainer.propTypes = searchResultContainerPropTypes

export default SearchResultContainer
