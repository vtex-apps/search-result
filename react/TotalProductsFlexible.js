import React from 'react'
import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'
import { path } from 'ramda'

import TotalProducts from './TotalProducts'

import styles from './searchResult.css'

const withSearchPageContextProps = Component => () => {
  const { searchQuery } = useSearchPage()
  const recordsFiltered = path(
    ['data', 'productSearch', 'recordsFiltered'],
    searchQuery
  )
  return (
    <Component
      recordsFiltered={recordsFiltered}
      wrapperClass={styles['totalProducts--layout']}
    />
  )
}

export default withSearchPageContextProps(TotalProducts)
