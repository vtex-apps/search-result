import React, { useMemo } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Container } from 'vtex.store-components'
import { useCssHandles } from 'vtex.css-handles'
import { useRuntime } from 'vtex.render-runtime'

import { PopupProvider } from './Popup'
import { ProductsPositionOffsetProvider } from './ProductsPositionOffsetContext'
import SearchResult from './SearchResult'
import { searchResultContainerPropTypes } from '../constants/propTypes'
import { useFetchMore } from '../hooks/useFetchMore'
import { PAGINATION_TYPE } from '../constants/paginationType'
import { getProductsPositionOffset } from '../utils/getProductsPositionOffset'

const CSS_HANDLES = ['searchResultContainer']
/**
 * Search Result Container Component.
 */
const SearchResultContainer = props => {
  const {
    maxItemsPerPage = 10,
    searchQuery: {
      fetchMore,
      data: {
        facets: {
          brands = [],
          specificationFilters = [],
          priceRanges = [],
          categoriesTrees,
          breadcrumb: facetsBreadcrumb = [],
        } = {},
        productSearch: {
          products = [],
          recordsFiltered,
          breadcrumb: productBreadcrumb = [],
        } = {},
      } = {},
      loading,
      variables: { query, map, orderBy, priceRange, from: queryFrom = 0 },
    },
    pagination,
    page,
    children,
    lazyItemsRemaining,
  } = props

  const queryData = {
    query,
    map,
    orderBy,
    priceRange,
  }

  const {
    handleFetchMoreNext,
    handleFetchMorePrevious,
    loading: fetchMoreLoading,
    from,
    to,
    infiniteScrollError,
  } = useFetchMore({
    page,
    recordsFiltered,
    maxItemsPerPage,
    fetchMore,
    products: products.filter(p => !p?.advertisement) || products,
    queryData,
  })

  const { query: runtimeQuery } = useRuntime()
  const urlPage = runtimeQuery.page ? Number(runtimeQuery.page) : page || 1

  const productsPositionOffset = useMemo(
    () =>
      getProductsPositionOffset({
        from,
        queryFrom,
        maxItemsPerPage,
        productsCount: products.length,
        urlPage,
      }),
    [from, queryFrom, maxItemsPerPage, products.length, urlPage]
  )

  const handles = useCssHandles(CSS_HANDLES)

  const breadcrumb = productBreadcrumb || facetsBreadcrumb

  const resultComponent = children || (
    <SearchResult
      {...props}
      breadcrumbsProps={{ breadcrumb }}
      onFetchMore={handleFetchMoreNext}
      fetchMoreLoading={fetchMoreLoading}
      onFetchPrevious={handleFetchMorePrevious}
      pagination={pagination}
      query={query}
      loading={loading}
      recordsFiltered={recordsFiltered}
      products={products}
      brands={brands}
      specificationFilters={specificationFilters}
      priceRanges={priceRanges}
      tree={categoriesTrees}
      to={to}
      from={from}
      infiniteScrollError={infiniteScrollError}
      lazyItemsRemaining={lazyItemsRemaining}
    />
  )

  const infiniteScrollComponent = (
    <InfiniteScroll
      style={{ overflow: 'none' }}
      dataLength={products.length}
      next={handleFetchMoreNext}
      hasMore={to + 1 < recordsFiltered}
      useWindow={false}
    >
      {resultComponent}
    </InfiniteScroll>
  )

  const isInfiniteScroll = pagination !== PAGINATION_TYPE.SHOW_MORE

  return (
    <Container className={`${handles.searchResultContainer} pt3-m pt5-l`}>
      <PopupProvider>
        <ProductsPositionOffsetProvider value={productsPositionOffset}>
          <div id="search-result-anchor" />
          {isInfiniteScroll ? infiniteScrollComponent : resultComponent}
        </ProductsPositionOffsetProvider>
      </PopupProvider>
    </Container>
  )
}

SearchResultContainer.propTypes = searchResultContainerPropTypes

export default SearchResultContainer
