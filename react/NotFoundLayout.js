import React, { useMemo } from 'react'
import { SearchPageContext } from 'vtex.search-page-context/SearchPageContext'
import { useCssHandles, applyModifiers } from 'vtex.css-handles'
import { generateBlockClass } from '@vtex/css-handles'

const CSS_HANDLES = ['notFound']

//import styles from './searchResult.css'

const NotFoundLayout = ({
  children,
  searchQuery,
  maxItemsPerPage,
  map,
  params,
  priceRange,
  orderBy,
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
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <SearchPageContext.Provider value={context}>
      <div
        className={`${applyModifiers(
          handles.notFound,
          'layout'
        )} flex flex-column flex-grow-1`}
      >
        {children}
      </div>
    </SearchPageContext.Provider>
  )
}

export default NotFoundLayout
