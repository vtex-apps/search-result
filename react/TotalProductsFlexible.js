import React from 'react'
import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'
import { path } from 'ramda'

import TotalProducts from './TotalProducts'

import styles from './searchResult.css'

const withSearchPageContextProps = Component => ({ message }) => {
  const { searchQuery } = useSearchPage()
  const recordsFiltered = path(
    ['data', 'productSearch', 'recordsFiltered'],
    searchQuery
  )
  return (
    <Component
      message={message}
      recordsFiltered={recordsFiltered}
      wrapperClass={styles['totalProducts--layout']}
    />
  )
}

const TotalProductsFlexible = withSearchPageContextProps(TotalProducts)

TotalProductsFlexible.schema = {
  title: 'admin/editor.search-result.total-products',
}

export default TotalProductsFlexible
