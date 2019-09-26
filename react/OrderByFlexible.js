import React from 'react'
import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'

import OrderBy from './OrderBy'

import styles from './searchResult.css'

const withSearchPageContextProps = Component => (props) => {
  const { orderBy } = useSearchPage()
  if (orderBy == null) {
    return null
  }

  return (
    <div className={styles['orderBy--layout']}>
      <Component {...props} orderBy={orderBy} />
    </div>
  )
}

export default withSearchPageContextProps(OrderBy)
