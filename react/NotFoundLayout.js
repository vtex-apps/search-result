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

  const { searchId, redirect } = searchQuery?.data?.productSearch || {}
  const shouldAddAFAttr = searchId && !redirect

  return (
    <SearchPageContext.Provider value={context}>
      <div
        className={`${generateBlockClass(
          styles['notFound--layout'],
          blockClass
        )} flex flex-column flex-grow-1`}
        data-af-element={shouldAddAFAttr ? 'search-result' : undefined}
        data-af-onimpression={shouldAddAFAttr ? true : undefined}
        data-af-search-id={shouldAddAFAttr ? searchId : undefined}
      >
        {children}
      </div>
    </SearchPageContext.Provider>
  )
}

export default NotFoundLayout
