import React from 'react'
import { path } from 'ramda'
import classNames from 'classnames'
import FetchMoreButton from './components/loaders/FetchMoreButton'
import LoadingSpinner from './components/loaders/LoadingSpinner'
import { PAGINATION_TYPE } from './constants/paginationType'
import { useFetchMore } from './hooks/useFetchMore'

import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'

import styles from './searchResult.css'

const FetchMore = () => {
  const { pagination, searchQuery, maxItemsPerPage, page } = useSearchPage()
  const products = path(['data', 'productSearch', 'products'], searchQuery)
  const recordsFiltered = path(
    ['data', 'productSearch', 'recordsFiltered'],
    searchQuery
  )
  const fetchMore = path(['fetchMore'], searchQuery)
  const variables = path(['variables'], searchQuery)
  const client = path(['client'], searchQuery)

  const { handleFetchMoreNext, loading, to } = useFetchMore({
    page,
    recordsFiltered,
    maxItemsPerPage,
    fetchMore,
    products,
    variables,
    client,
  })

  const isShowMore = pagination === PAGINATION_TYPE.SHOW_MORE

  if (isShowMore) {
    return (
      <div
        className={classNames(
          styles['buttonShowMore--layout'],
          'w-100 flex justify-center'
        )}
      >
        <FetchMoreButton
          products={products}
          to={to}
          recordsFiltered={recordsFiltered}
          onFetchMore={handleFetchMoreNext}
          loading={loading}
          showProductsCount={false}
        />
      </div>
    )
  }

  return <LoadingSpinner loading={loading} />
}

export default FetchMore
