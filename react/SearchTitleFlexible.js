import React from 'react'

import { useBreadcrumb } from './hooks/useBreadcrumb'
import SearchTitle from './SearchTitle'
import styles from './searchResult.css'

const withSearchPageContextProps = (Component) => () => {
  const breadcrumb = useBreadcrumb()

  return (
    <Component
      breadcrumb={breadcrumb}
      wrapperClass={styles['galleryTitle--layout']}
    />
  )
}

export default withSearchPageContextProps(SearchTitle)
