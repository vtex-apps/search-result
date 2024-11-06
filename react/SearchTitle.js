import classNames from 'classnames'
import React from 'react'

import styles from './searchResult.css'
import { useSearchTitle } from './hooks/useSearchTitle'

const SHIPPING_MESSAGES = [
  'delivery',
  'pickup-all',
  'pickup-in-point',
  'pickup-nearby',
]

const SearchTitle = props => {
  const { breadcrumb: breadcrumbProp, wrapperClass = styles.galleryTitle } =
    props

  const title = useSearchTitle(breadcrumbProp || [], {
    matchFt: true,
    fallbackToLastName: true,
  })

  if (!title || SHIPPING_MESSAGES.includes(title)) {
    return null
  }

  return <h1 className={classNames(wrapperClass, 't-heading-1')}>{title}</h1>
}

export default SearchTitle
