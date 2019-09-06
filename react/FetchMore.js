import React from 'react'
import { path } from 'ramda'
import { Spinner, Button } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'
import classNames from 'classnames'

import {
  useSearchPageState,
  useSearchPage,
  useSearchPageStateDispatch,
} from 'vtex.search-page-context/SearchPageContext'

import styles from './searchResult.css'

const FetchMore = () => {
  const { pagination, searchQuery } = useSearchPage()
  const { isFetchingMore } = useSearchPageState()
  const dispatch = useSearchPageStateDispatch()
  const products = path(['data', 'productSearch', 'products'], searchQuery)
  const recordsFiltered = path(
    ['data', 'productSearch', 'recordsFiltered'],
    searchQuery
  )

  const changeState = () =>
    dispatch({ type: 'SET_FETCHING_MORE', args: { isFetchingMore: true } })

  const isShowMore = pagination === 'show-more'

  if (isFetchingMore === undefined) {
    return null
  }

  if (isShowMore) {
    return (
      <div
        className={classNames(
          styles['buttonShowMore--layout'],
          'w-100 flex justify-center'
        )}
      >
        {products && products.length < recordsFiltered && (
          <Button onClick={changeState} isLoading={isFetchingMore} size="small">
            <FormattedMessage id="store/search-result.show-more-button" />
          </Button>
        )}
      </div>
    )
  }

  return (
    isFetchingMore && (
      <div className="w-100 flex justify-center">
        <div className="w3 ma0">
          <Spinner />
        </div>
      </div>
    )
  )
}

export default FetchMore
