import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { IconCaretLeft, IconCaretRight } from 'vtex.styleguide'

export default class SearchFooter extends Component {
  static contextTypes = {
    navigate: PropTypes.func,
  }

  static propTypes = {
    /** Amount of products matched with the filters. */
    recordsFiltered: PropTypes.number.isRequired,
    /** Page number */
    page: PropTypes.number.isRequired,
    /** Maximum number of items per page. */
    maxItemsPerPage: PropTypes.number.isRequired,
    /** Returns the link props. */
    getLinkProps: PropTypes.func.isRequired,
  }

  handleClick = pageNumber => this.navigateTo(pageNumber)

  navigateTo = pageNumber => {
    const { page, params, queryString: query } = this.props.getLinkProps({
      pageNumber,
    })
    return this.context.navigate({
      page,
      params,
      query,
    })
  }

  render() {
    const { recordsFiltered, page, maxItemsPerPage } = this.props
    const lastPage = Math.ceil(recordsFiltered / maxItemsPerPage)
    return (
      <div className="flex justify-center">
        <div onClick={() => this.handleClick(page - 1)}>
          {page > 1 && <IconCaretLeft />}
        </div>
        <div onClick={() => this.handleClick(page + 1)}>
          {page < lastPage && <IconCaretRight />}
        </div>
      </div>
    )
  }
}
