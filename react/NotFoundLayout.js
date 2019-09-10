import React, { useMemo } from 'react'
import { SearchPageContext } from 'vtex.search-page-context/SearchPageContext'
import { generateBlockClass } from '@vtex/css-handles'

import styles from './searchResult.css'

const NotFoundLayout = ({
  children,
  searchQuery,
  maxItemsPerPage,
  map,
  params,
  priceRange,
  orderBy,
  blockClass,
}) => {
  const context = useMemo(
    () => ({
      searchQuery,
      maxItemsPerPage,
      map,
      params,
      priceRange,
      orderBy,
    }),
    [map, maxItemsPerPage, orderBy, params, priceRange, searchQuery]
  )

  return (
    <SearchPageContext.Provider value={context}>
      <div
        className={`${generateBlockClass(
          styles['notFound--layout'],
          blockClass
        )} flex flex-column flex-grow-1`}
      >
        {children}
      </div>
    </SearchPageContext.Provider>
  )
}

export default NotFoundLayout
