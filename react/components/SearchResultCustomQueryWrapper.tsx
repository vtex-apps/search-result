import React, { Fragment, useMemo } from 'react'
import type { RuntimeWithRoute } from 'vtex.render-runtime'
import { canUseDOM, useRuntime, Helmet } from 'vtex.render-runtime'
import queryString from 'query-string'

import useDataPixel from '../hooks/useDataPixel'
import { usePageView } from '../hooks/usePageView'
import type { SearchQuery } from '../utils/searchMetadata'
import {
  getCategoryMetadata,
  getDepartmentMetadata,
  getPageEventName,
  getSearchMetadata,
  getTitleTag,
} from '../utils/searchMetadata'

interface GetHelmetLinkParams {
  canonicalLink: string | undefined
  page: number
  rel: 'canonical' | 'prev' | 'next'
}

interface GetSearchCanonicalParams {
  canonicalLink: string
  page?: number
}

interface IsNotLastPageParams {
  products: any
  to: number | undefined
  recordsFiltered: number | undefined
}

function getHelmetLink({ canonicalLink, page, rel }: GetHelmetLinkParams) {
  if (!canonicalLink) {
    return null
  }

  let pageAfterTransformation = 0

  if (rel === 'canonical') {
    pageAfterTransformation = page
  } else if (rel === 'next') {
    pageAfterTransformation = page + 1
  } else if (rel === 'prev') {
    pageAfterTransformation = page - 1
  }

  const canonicalWithParams = getSearchCanonical({
    canonicalLink,
    page: pageAfterTransformation,
  })

  if (!canonicalWithParams) {
    return null
  }

  return {
    rel,
    href: canonicalWithParams,
  }
}

function getSearchCanonical({ canonicalLink, page }: GetSearchCanonicalParams) {
  if (page !== null && page !== undefined && page < 1) {
    return null
  }

  const query = {
    page: page !== undefined && page !== null && page > 1 ? page : undefined,
  }

  const canonicalWithPage = queryString.stringifyUrl({
    url: canonicalLink,
    query,
  })

  return canonicalWithPage
}

function useCanonicalLink() {
  const { route, rootPath = '' } = useRuntime() as RuntimeWithRoute
  const { canonicalPath } = route

  const canonicalHost = window.__hostname__ ?? window.location?.hostname

  if (!canonicalHost || !canonicalPath) {
    return undefined
  }

  const canonicalLink = `https://${canonicalHost}${rootPath}${canonicalPath}`

  return canonicalLink
}

function isNotLastPage({ products, to, recordsFiltered }: IsNotLastPageParams) {
  if (
    !products ||
    to === undefined ||
    to === null ||
    recordsFiltered === undefined ||
    recordsFiltered === null
  ) {
    return null
  }

  return to + 1 < recordsFiltered
}

const getSearchIdentifier = (
  searchQuery: SearchQuery,
  orderBy?: string,
  page?: string
) => {
  const { variables } = searchQuery

  if (!variables) {
    return
  }

  const { query, map } = variables

  return query + map + (orderBy ?? '') + (page ?? '')
}

const SearchResultCustomQueryWrapper = (props: any) => {
  const { localSearchQueryData, children } = props

  const {
    maxItemsPerPage,
    searchQuery,
    searchQuery: {
      data: {
        searchMetadata: { titleTag = '' } = {},
        productSearch: {
          products: currProducts = undefined,
          recordsFiltered: currRecords = undefined,
        } = {},
        facets: { recordsFiltered: legacyRecords, queryArgs },
        products: legacyProducts,
      },
      variables: { fullText },
    },
    orderBy,
    facetsLoading,
  } = localSearchQueryData

  const loading = searchQuery ? searchQuery.loading : undefined
  const products = currProducts ?? legacyProducts
  const recordsFiltered = currRecords ?? legacyRecords

  const {
    getSettings,
    account,
    query: { page: pageFromQuery = '1' },
    route: { title: pageTitle },
  } = useRuntime() as RuntimeWithRoute

  const settings = getSettings('vtex.store') || {}
  const {
    titleTag: defaultStoreTitle,
    storeName,
    enablePageNumberTitle = false,
    removeStoreNameTitle = false,
  } = settings

  const title = getTitleTag({
    titleTag,
    storeTitle: storeName || defaultStoreTitle,
    term: fullText,
    pageTitle,
    pageNumber: enablePageNumberTitle ? Number(pageFromQuery) : 0,
    removeStoreNameTitle,
  })

  const pixelEvents = useMemo(() => {
    if (!canUseDOM || !currProducts || !queryArgs || facetsLoading) {
      return null
    }

    const event = getPageEventName(
      currProducts,
      localSearchQueryData.searchQuery.variables
    )

    const pageInfoEvent = {
      event: 'pageInfo',
      eventType: event,
      accountName: account,
      pageUrl: window.location.href,
      orderBy,
      page: pageFromQuery,
      category: searchQuery?.data
        ? getCategoryMetadata(searchQuery.data)
        : null,
      department: searchQuery?.data
        ? getDepartmentMetadata(searchQuery.data)
        : null,
      search: searchQuery?.data ? getSearchMetadata(searchQuery.data) : null,
    }

    return [
      pageInfoEvent,
      {
        event,
        products: currProducts,
      },
    ]
  }, [
    currProducts,
    queryArgs,
    facetsLoading,
    localSearchQueryData.searchQuery.variables,
    account,
    orderBy,
    pageFromQuery,
    searchQuery.data,
  ])

  const pixelCacheKey = getSearchIdentifier(searchQuery, orderBy, pageFromQuery)

  usePageView({ title, cacheKey: pixelCacheKey })
  useDataPixel(pixelEvents, pixelCacheKey, loading)

  const canonicalLink = useCanonicalLink()
  const pageNumber = Number(pageFromQuery)

  /* 
    fetch more doesn't update "page" until rerender 
    so corresponding "to" isn't updated either
    get "to" base on current "page" from query string
  */
  const currTo = pageNumber * maxItemsPerPage - 1

  return (
    <Fragment>
      <Helmet
        link={[
          getHelmetLink({
            canonicalLink,
            page: pageNumber,
            rel: 'canonical',
          }),
          getHelmetLink({
            canonicalLink,
            page: pageNumber,
            rel: 'prev',
          }),
          isNotLastPage({
            products,
            to: currTo,
            recordsFiltered,
          })
            ? getHelmetLink({
                canonicalLink,
                page: pageNumber,
                rel: 'next',
              })
            : null,
        ].filter(Boolean)}
      />

      {children}
    </Fragment>
  )
}

export default SearchResultCustomQueryWrapper
