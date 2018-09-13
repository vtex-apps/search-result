import React, { Component } from 'react'
import { Button } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'


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
      renderFilters,
      renderBreadcrumb,
      renderTotalProducts,
      renderOrderBy,
      renderGallery,
      productsLength,
      recordsFiltered,
      fetchMoreLoading,
    } = this.props

    return (
      <div className="vtex-search-result vtex-search-result--show-more pv5 ph9-l ph7-m ph5-s">
        {renderBreadcrumb()}
        {renderTotalProducts()}
        {renderFilters()}
        <div className="vtex-search-result__border" />
        {renderOrderBy()}
        {renderGallery()}
        <div className="vtex-search-result__button--show-more w-100 flex justify-end">
          <Button onClick={this.handleFetchMore} disabled={!(productsLength < recordsFiltered)} isLoading={fetchMoreLoading} size="small">
            <FormattedMessage
              id="search-result.show-more-button"
            />
          </Button>
        </div>
      </div>
    )
  }
}

ShowMoreLoaderResult.propTypes = loaderPropTypes