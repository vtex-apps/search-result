import PropTypes from 'prop-types'
import { range } from 'ramda'
import React, { Component, Fragment } from 'react'
import { IconCaretLeft, IconCaretRight } from 'vtex.styleguide'
import { withRuntimeContext } from 'render'

class SearchFooter extends Component {
  static propTypes = {
    /** Amount of products matched with the filters. */
    recordsFiltered: PropTypes.number.isRequired,
    /** Page number */
    page: PropTypes.number.isRequired,
    /** Maximum number of items per page. */
    maxItemsPerPage: PropTypes.number.isRequired,
    /** Returns the link props. */
    getLinkProps: PropTypes.func.isRequired,
    /** Render Runtime Context */
    runtime: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
    }).isRequired,
  }

  handleClick = pageNumber => this.navigateTo(pageNumber)

  navigateTo = pageNumber => {
    const { page, params, queryString: query } = this.props.getLinkProps({
      pageNumber,
    })
    return this.props.runtime.navigate({
      page,
      params,
      query,
      scrollOptions: { elementId: 'search-result-anchor' },
    })
  }

  getNumberButtonsFromRange = (begin, end) =>
    range(begin, end).map(pageNumber => (
      <div
        className={`ph2 pointer ${
          pageNumber === this.props.page ? 'near-black' : 'gray'
        }`}
        onClick={() => this.handleClick(pageNumber)}
        key={pageNumber}>
        {pageNumber}
      </div>
    ))

  render() {
    const { recordsFiltered, page, maxItemsPerPage } = this.props
    const lastPage = Math.ceil(recordsFiltered / maxItemsPerPage)
    const maxNumberButtons = 5
    return (
      <div className="flex justify-center b">
        {page > 1 && (
          <div
            className="ph2 pointer"
            onClick={() => this.handleClick(page - 1)}>
            <IconCaretLeft />
          </div>
        )}
        {page > maxNumberButtons ? (
          <Fragment>
            <div className="ph2 gray pointer">1</div>
            <div className="ph2 gray">&hellip;</div>
            {page <= lastPage - maxNumberButtons ? (
              <Fragment>
                <div
                  className="ph2 pointer gray"
                  onClick={() => this.handleClick(page - 1)}>
                  {page - 1}
                </div>
                <div
                  className="ph2 pointer near-black"
                  onClick={() => this.handleClick(page)}>
                  {page}
                </div>
                <div
                  className="ph2 pointer gray"
                  onClick={() => this.handleClick(page + 1)}>
                  {page + 1}
                </div>
                <div className="ph2 gray">&hellip;</div>
                <div
                  className="ph2 pointer gray"
                  onClick={() => this.handleClick(lastPage)}>
                  {lastPage}
                </div>
              </Fragment>
            ) : (
              this.getNumberButtonsFromRange(
                lastPage - maxNumberButtons + 1,
                lastPage + 1
              )
            )}
          </Fragment>
        ) : (
          <Fragment>
            {this.getNumberButtonsFromRange(
              1,
              Math.min(lastPage, maxNumberButtons) + 1
            )}
            {lastPage > maxNumberButtons && (
              <div className="ph2 gray">&hellip;</div>
            )}
            {page !== lastPage &&
              lastPage > maxNumberButtons && (
              <div
                className="ph2 pointer gray"
                onClick={() => this.handleClick(lastPage)}>
                {lastPage}
              </div>
            )}
          </Fragment>
        )}
        {page < lastPage && (
          <div
            className="ph2 pointer"
            onClick={() => this.handleClick(page + 1)}>
            <IconCaretRight />
          </div>
        )}
      </div>
    )
  }
}

export default withRuntimeContext(SearchFooter)
