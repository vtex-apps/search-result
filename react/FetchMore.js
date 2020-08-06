import React from 'react'
import { path } from 'ramda'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import FetchMoreButton from './components/loaders/FetchMoreButton'
import LoadingSpinner from './components/loaders/LoadingSpinner'
import { PAGINATION_TYPE } from './constants/paginationType'
import { useFetchMore } from './hooks/useFetchMore'

import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'

import styles from './searchResult.css'

const FetchMore = ({ htmlElementForButton = 'button '}) => {
  const { pagination, searchQuery, maxItemsPerPage, page } = useSearchPage()
  const products = path(['data', 'productSearch', 'products'], searchQuery)
  const recordsFiltered = path(
    ['data', 'productSearch', 'recordsFiltered'],
    searchQuery
  )
  const fetchMore = path(['fetchMore'], searchQuery)
  const queryData = {
    query: path(['variables', 'query'], searchQuery),
    map: path(['variables', 'map'], searchQuery),
    orderBy: path(['variables', 'orderBy'], searchQuery),
    priceRange: path(['variables', 'priceRange'], searchQuery),
  }

  const { handleFetchMoreNext, loading, to } = useFetchMore({
    page,
    recordsFiltered,
    maxItemsPerPage,
    fetchMore,
    products,
    queryData,
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
          htmlElementForButton={htmlElementForButton}
        />
      </div>
    )
  }

  return <LoadingSpinner loading={loading} />
}

FetchMore.propTypes = {
  /* html element to render for fetch more button */
  htmlElementForButton: PropTypes.string,
}

export default FetchMore
