import React, { useEffect } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

import { PopupProvider } from './Popup'
import SearchResult from './SearchResult'
import { searchResultContainerPropTypes } from '../constants/propTypes'
import { useFetchMore } from '../hooks/useFetchMore'
import { PAGINATION_TYPE } from '../constants/paginationType'
import { Container } from 'vtex.store-components'

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
        } = {},
        productSearch: { products = [], recordsFiltered, breadcrumb = [] } = {},
      } = {},
      loading,
      variables: { query },
    },
    pagination,
    page,
    children,
  } = props

  const {
    resetPage,
    handleFetchMoreNext,
    handleFetchMorePrevious,
    loading: fetchMoreLoading,
    from,
    to,
  } = useFetchMore(page, recordsFiltered, maxItemsPerPage, fetchMore, products)

  useEffect(() => {
    console.log('USE-EFFECT')
    console.log('query', query)
    console.log('facets', props.searchQuery.data.facets)
    resetPage()
  }, [query, specificationFilters, brands])

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
    <Container className="pt3-m pt5-l">
      <PopupProvider>
        <div id="search-result-anchor" />
        {isInfiniteScroll ? infiniteScrollComponent : resultComponent}
      </PopupProvider>
    </Container>
  )
}

SearchResultContainer.propTypes = searchResultContainerPropTypes

export default SearchResultContainer
