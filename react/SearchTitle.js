import classNames from 'classnames'
import React from 'react'
import { zip } from 'ramda'

import styles from './searchResult.css'

const getClusterById = (products, id) => {
  if (!products) {
    return
  }

  for (const product of products) {
    for (const cluster of product.productClusters) {
      if (cluster.id === id) {
        return cluster.name
      }
    }
  }
}

const SearchTitle = ({ params, map, products }) => {
  // Terrible hotfix for product cluster name below!!!
  // Should be updated with a better version

  let title = null

  // matches title "sources" with its respective map,
  // and gets the last valid one
  const titleSources = zip([
    params.department,
    params.category,
    params.subcategory,
    params.term,
  ], map.split(',')).reverse()
  const [titleValue, titleMap] = titleSources.find(([param]) => !!param)

  // if the title maps to productClusterIds, gets the cluster name
  // from the product list (which hopefully at least one
  // product will have listed on its productClusters key)
  if (titleMap === 'productClusterIds') {
    const productCluster = getClusterById(products, titleValue)

    if (productCluster) {
      title = productCluster
    }
  } else {
    title = titleValue
  }

  if (!title) {
    return null
  }

  return (
    <h1 className={classNames(styles.galleryTitle, 't-heading-1')}>{decodeURI(title)}</h1>
  )
}

export default SearchTitle
