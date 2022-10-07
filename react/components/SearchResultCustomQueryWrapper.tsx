import React, { Fragment } from 'react'
import type { RuntimeWithRoute } from 'vtex.render-runtime'
import { useRuntime, Helmet } from 'vtex.render-runtime'
import queryString from 'query-string'

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

const SearchResultCustomQueryWrapper = (props: any) => {
  const { localSearchQueryData, children } = props

  const {
    maxItemsPerPage,
    searchQuery: {
      data: {
        productSearch: {
          products: currProducts = undefined,
          recordsFiltered: currRecords = undefined,
        } = {},
        facets: { recordsFiltered: legacyRecords },
        products: legacyProducts,
      },
    },
  } = localSearchQueryData

  const products = currProducts ?? legacyProducts
  const recordsFiltered = currRecords ?? legacyRecords

  const {
    query: { page: pageFromQuery = 1 },
  } = useRuntime() as RuntimeWithRoute

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
