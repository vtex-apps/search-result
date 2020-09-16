import React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

import { PopupProvider } from './Popup'
import SearchResult from './SearchResult'
import { searchResultContainerPropTypes } from '../constants/propTypes'
import { useFetchMore } from '../hooks/useFetchMore'
import { PAGINATION_TYPE } from '../constants/paginationType'
import { Container } from 'vtex.store-components'
import { useCssHandles } from 'vtex.css-handles'

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
      variables: { query, map, orderBy, priceRange },
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
    products,
    queryData,
  })
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

  const isInfiniteScroll = pagination != PAGINATION_TYPE.SHOW_MORE

  return (
    <Container className={`${handles.searchResultContainer} pt3-m pt5-l`}>
      <PopupProvider>
        <div id="search-result-anchor" />
        {isInfiniteScroll ? infiniteScrollComponent : resultComponent}
      </PopupProvider>
    </Container>
  )
}

SearchResultContainer.propTypes = searchResultContainerPropTypes

export default SearchResultContainer
