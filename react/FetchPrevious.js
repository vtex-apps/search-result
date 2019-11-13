import React from 'react'
import { path } from 'ramda'
import classNames from 'classnames'
import FetchPreviousButton from './components/loaders/FetchPreviousButton'
import { useFetchMore } from './hooks/useFetchMore'
import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'

import styles from './searchResult.css'

const FetchPrevious = () => {
  const { searchQuery, maxItemsPerPage, page } = useSearchPage()
  const products = path(['data', 'productSearch', 'products'], searchQuery)
  const recordsFiltered = path(
    ['data', 'productSearch', 'recordsFiltered'],
    searchQuery
  )

  const fetchMore = path(['fetchMore'], searchQuery)
  const variables = path(['variables'], searchQuery)
  const client = path(['client'], searchQuery)

  const { handleFetchMorePrevious, loading, from } = useFetchMore({
    page,
    recordsFiltered,
    maxItemsPerPage,
    fetchMore,
    products,
    variables,
    client,
  })

  return (
    <div
      className={classNames(
        styles['buttonShowMore--layout'],
        'w-100 flex justify-center'
      )}
    >
      <FetchPreviousButton
        products={products}
        from={from}
        recordsFiltered={recordsFiltered}
        onFetchPrevious={handleFetchMorePrevious}
        loading={loading}
      />
    </div>
  )
}

export default FetchPrevious
