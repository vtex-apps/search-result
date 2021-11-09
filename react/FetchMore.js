import React from 'react'
// eslint-disable-next-line no-restricted-imports
import { path } from 'ramda'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'

import FetchMoreButton from './components/loaders/FetchMoreButton'
import LoadingSpinner from './components/loaders/LoadingSpinner'
import { PAGINATION_TYPE } from './constants/paginationType'
import { useFetchMore } from './hooks/useFetchMore'
import styles from './searchResult.css'

const FetchMore = ({ htmlElementForButton = 'button' }) => {
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

  const { handleFetchMoreNext, loading, to, nextPage } = useFetchMore({
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
          nextPage={nextPage}
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

FetchMore.schema = {
  title: 'admin/editor.search-result.fetch-more',
}

export default FetchMore
