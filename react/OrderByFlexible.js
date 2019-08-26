import React from 'react'
import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'

import OrderBy from './OrderBy'

import styles from './searchResult.css'

const withSearchPageContextProps = Component => () => {
  const { orderBy } = useSearchPage()
  if (orderBy == null) {
    return null
  }

  return (
    <Component orderBy={orderBy} wrapperClass={styles['orderBy--layout']} />
  )
}

export default withSearchPageContextProps(OrderBy)
