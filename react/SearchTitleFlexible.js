import React from 'react'
import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'
import { path } from 'ramda'

import SearchTitle from './SearchTitle'

import styles from './searchResult.css'

const withSearchPageContextProps = Component => () => {
  const { searchQuery } = useSearchPage()
  const breadcrumb =
    path(['data', 'productSearch', 'breadcrumb'], searchQuery) ||
    path(['data', 'facets', 'breadcrumb'], searchQuery)

  return (
    <Component
      breadcrumb={breadcrumb}
      wrapperClass={styles['galleryTitle--layout']}
    />
  )
}

export default withSearchPageContextProps(SearchTitle)
