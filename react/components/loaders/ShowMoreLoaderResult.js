import React, { Component } from 'react'
import { Button } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'

import SearchResult from '../SearchResult'
import { loaderPropTypes } from '../../constants/propTypes'

/**
 * Search Result Component.
 */
export default class ShowMoreLoaderResult extends Component {
  handleFetchMore = () => {
    const {
      to,
      onSetFetchMoreLoading,
      maxItemsPerPage,
      fetchMore,
      onFetchMoreProducts,
    } = this.props

    onSetFetchMoreLoading(true)

    fetchMore({
      variables: {
        from: to,
        to: to + maxItemsPerPage - 1,
      },
      updateQuery: onFetchMoreProducts,
    })
  }

  render() {
    const {
      products,
      recordsFiltered,
      fetchMoreLoading,
    } = this.props

    return (
      <SearchResult {...this.props}>
        <div className="vtex-search-result__button--show-more w-100 flex justify-end">
          <Button onClick={this.handleFetchMore} disabled={!(products.length < recordsFiltered)} isLoading={fetchMoreLoading} size="small">
            <FormattedMessage
              id="search-result.show-more-button"
            />
          </Button>
        </div>
      </SearchResult>
    )
  }
}

ShowMoreLoaderResult.propTypes = loaderPropTypes