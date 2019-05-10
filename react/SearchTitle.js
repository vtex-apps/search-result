import classNames from 'classnames'
import React from 'react'
import { zip } from 'ramda'

import styles from './searchResult.css'

const isIterable = object =>
  object != null && typeof object[Symbol.iterator] === 'function'

const getClusterById = (products, id) => {
  if (!isIterable(products)) {
    return
  }

  for (const product of products) {
    if (!product || !isIterable(product.productClusters)) {
      continue
    }
    for (const cluster of product.productClusters) {
      if (cluster.id === id) {
        return cluster.name
      }
    }
  }
}

const padRight = (array, num) =>
  array.concat(Array.from(Array(num))).slice(0, num)

const SearchTitle = ({ params, map, products }) => {
  // Terrible hotfix for product clusters/collections name below!
  // The title should come from store-graphql. Once that's done, 
  // all this logic should be removed from here.

  let title = null

  // matches title "sources" with its respective map,
  // and gets the last valid one
  const categories = [
    params.department,
    params.category,
    params.subcategory,
    params.term,
  ]

  const splitMap = padRight(map ? map.split(',') : [], categories.length)

  const titleSources = zip(categories, splitMap).reverse()

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
