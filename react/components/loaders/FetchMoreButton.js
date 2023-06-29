import React, { Fragment, useState, useEffect } from 'react'
import { Button } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'
import { FormattedMessage } from 'react-intl'
import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'
import { useRuntime } from 'vtex.render-runtime'

const CSS_HANDLES = [
  'buttonShowMore',
  'showingProducts',
  'showingProductsCount',
]

const useShowButton = (to, products, loading, recordsFiltered) => {
  const [showButton, setShowButton] = useState(
    !!products && Math.max(to + 1, products.length) < recordsFiltered
  )

  useEffect(() => {
    if (!loading) {
      setShowButton(
        !!products && Math.max(to + 1, products.length) < recordsFiltered
      )
    }
  }, [to, products, loading, recordsFiltered])

  return showButton
}

function shouldNotIncludeMap(map) {
  if (
    !map ||
    map === 'b' ||
    map === 'brand' ||
    map === 'c' ||
    map === 'category-1' ||
    map === 'department'
  ) {
    return true
  }

  const mapTree = map.split(',')

  if (mapTree.length > 3) {
    return false
  }

  return mapTree.every(mapItem => mapItem === 'c')
}

export function getMapQueryString(searchQuery, hideMap) {
  if (
    hideMap ||
    !searchQuery ||
    !searchQuery.variables ||
    shouldNotIncludeMap(searchQuery.variables.map)
  ) {
    return ''
  }

  return `&map=${searchQuery.variables.map}`
}

const FetchMoreButton = props => {
  const {
    products,
    to,
    recordsFiltered,
    onFetchMore,
    loading,
    showProductsCount,
    nextPage,
    htmlElementForButton,
  } = props

  const isAnchor = htmlElementForButton === 'a'
  const showButton = useShowButton(to, products, loading, recordsFiltered)
  const handles = useCssHandles(CSS_HANDLES)
  const { searchQuery } = useSearchPage()
  const { query } = useRuntime()
  const hideMap = !query?.map

  const handleFetchMoreClick = ev => {
    isAnchor && ev.preventDefault()
    onFetchMore()
  }

  return (
    <Fragment>
      <div className={`${handles.buttonShowMore} w-100 flex justify-center`}>
        {showButton && (
          <Button
            onClick={ev => handleFetchMoreClick(ev)}
            href={
              isAnchor &&
              `?page=${nextPage}${getMapQueryString(searchQuery, hideMap)}`
            }
            rel={isAnchor && 'next'}
            isLoading={loading}
            size="small"
            key={to} // Necessary to prevent focus after click
          >
            <FormattedMessage id="store/search-result.show-more-button" />
          </Button>
        )}
      </div>
      {showProductsCount && recordsFiltered && (
        <div
          className={`${handles.showingProducts} tc t-small pt3 c-muted-2 mt2`}
        >
          <FormattedMessage
            id="store/search-result.showing-products"
            tagName="span"
            values={{
              value: (
                <span className={`${handles.showingProductsCount} b`}>
                  <FormattedMessage
                    id="store/search-result.showing-products-count"
                    values={{
                      productsLoaded: products.length,
                      total: recordsFiltered,
                    }}
                  />
                </span>
              ),
            }}
          />
        </div>
      )}
    </Fragment>
  )
}

export default FetchMoreButton
