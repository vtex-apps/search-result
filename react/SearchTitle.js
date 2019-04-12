import classNames from 'classnames'
import React from 'react'

import styles from './searchResult.css'

const SearchTitle = ({ params }) => {
  const title = params.term ||
    params.subcategory ||
    params.category ||
    params.department

  return (
    <h1 className={classNames(styles.galleryTitle, 't-heading-1')}>
      {title}
    </h1>
  )
}

export default SearchTitle
