import React, { useEffect, useState } from 'react'
// eslint-disable-next-line no-restricted-imports
import { path } from 'ramda'
import classNames from 'classnames'
import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'

import LoadingSpinner from './components/loaders/LoadingSpinner'
import { PAGINATION_TYPE } from './constants/paginationType'
import { useFetchMore } from './hooks/useFetchMore'
import { IconCaret } from 'vtex.store-icons'
import styles from './searchResult.css'
import { Helmet } from 'vtex.render-runtime'

const Pagination = () => {
  const { pagination, searchQuery, maxItemsPerPage, page } = useSearchPage()
  const products = path(['data', 'productSearch', 'products'], searchQuery)
  const recordsFiltered = path(
    ['data', 'productSearch', 'recordsFiltered'],
    searchQuery
  )

  const fetchMore = path(['fetchMore'], searchQuery)
  const queryData = {
    query: path(['variables', 'query'], searchQuery),
    map: path(['variables', 'map'], searchQuery),
    orderBy: path(['variables', 'orderBy'], searchQuery),
    priceRange: path(['variables', 'priceRange'], searchQuery),
  }

  const { handleFetchSpecificPage, handleFetchSpecificPagePrev, handleFetchSpecificPageNext, loading } = useFetchMore({
    page,
    recordsFiltered,
    maxItemsPerPage,
    fetchMore,
    products,
    queryData,
  })

  const [activePageValue, setActivePageValue] = useState()
  const [activePage, setActivePage] = useState()
  const pagesNumber = Math.ceil(recordsFiltered / maxItemsPerPage)
  const pagesArray = Array.from({ length: Number(pagesNumber) }, (v, i) => i + 1)
  const isShowMore = pagination === PAGINATION_TYPE.SHOW_MORE

  const HelmetPagesLinks = () => (
    <Helmet>
      {pagesArray.map((v) => 
      v !== 1 
      ? (<link href={window.location && (window.location.origin + window.location.pathname + `?page=${v}`)} />) 
      : (<link href={window.location && (window.location.origin + window.location.pathname)} rel="canonical" />)
      )}
    </Helmet>
  )

  useEffect(() => {
    if (window.location && window.location.search.includes('?page')) {
      setActivePageValue(window.location.search && new URLSearchParams(window.location.search))
    }
  }, [JSON.stringify(window.location)])

  useEffect(() => {
    if (window.location && window.location.search.includes('?page') && activePageValue) {
      setActivePage(activePageValue.get('page'))
    } else {
      setActivePage("1")
    }
  }, [JSON.stringify(window.location), activePageValue])

  useEffect(() => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }, [activePage])

  const pageNumberStyle = (v) => {
    return classNames({
      [styles.paginationNumber]: v !== '...',
      [styles.selectedPaginationNumber]: parseInt(activePage) === v,
      [styles.paginationEllipsis]: v === '...',
    });
  }

  const handleManageNumberPages = (maxNumbersDisplayed, rate, totalPages) => {
    const x = maxNumbersDisplayed - rate,
      y = maxNumbersDisplayed + rate,
      pages = [];

    for (var i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= x && i <= y)) {
        pages.push(i);
      }
    }
    return pages;
  }

  const handleManageEllipsis = (dataArray) => {
    const finalPage = dataArray.pop();
    dataArray.push(finalPage);
    let ellipsisPagesArray = [];
    ellipsisPagesArray.push(1);

    for (var i = 1; i < dataArray.length - 1; i++) {
      if (dataArray[i - 1] === 1 && dataArray[i] !== 2) {
        ellipsisPagesArray.push('...');
      }
      ellipsisPagesArray.push(dataArray[i]);
      if (dataArray[i + 1] === finalPage && dataArray[i] !== (finalPage - 1)) {
        ellipsisPagesArray.push('...');
      }
    }

    ellipsisPagesArray.push(finalPage);

    return ellipsisPagesArray;
  }

  const paginationArray = handleManageEllipsis(handleManageNumberPages(Number(activePage), 1, pagesArray.length))

  if (isShowMore && pagesArray.length > 1) {
    return (
      <>
        <div className={classNames(styles['paginationLayout'])}>
          <div className={classNames(styles['paginationArrow'])} onClick={() => handleFetchSpecificPagePrev(activePage)}>
            <IconCaret orientation="left" />
          </div>
          <div className={classNames(styles['paginationNumbersContainer'])}>
            {paginationArray.map((v, i) =>
              <p key={i} className={pageNumberStyle(v)} onClick={() => handleFetchSpecificPage(v)}>{v}</p>
            )}
          </div>
          <div className={classNames(styles['paginationArrow'])} onClick={() => handleFetchSpecificPageNext(activePage, pagesArray)}>
            <IconCaret orientation="right" />
          </div>
        </div>
        <HelmetPagesLinks />
      </>
    )
  }

  return <LoadingSpinner loading={loading} />
}

Pagination.propTypes = {}

Pagination.schema = {
  title: 'admin/editor.search-result.pagination.paginate',
}

export default Pagination
