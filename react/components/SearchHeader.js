import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'

import Dropdown from '@vtex/styleguide/lib/Dropdown'
import VTEXClasses from '../constants/CSSClasses'
import SortOptions from '../constants/SortOptions'

/**
 * Displays the header information of the Gallery: the query used to find the products and a selector to choose the sorting type.
 */
class SearchHeader extends Component {
  static contextTypes = {
    navigate: PropTypes.func,
    intl: PropTypes.object.isRequired,
  }

  static propTypes = {
    /** Amount of products matched with the filters. */
    recordsFiltered: PropTypes.number.isRequired,
    /** Initial index position of records filtered. */
    from: PropTypes.number,
    /** Final index position of records filtered. */
    to: PropTypes.number,
    /** Wich sorting option is selected. */
    orderBy: PropTypes.string.isRequired,
    /** Returns the link props. */
    getLinkProps: PropTypes.func,
  }

  sortingOptions() {
    const context = this.context
    return SortOptions.map(opt => {
      return { value: opt.value, label: context.intl.formatMessage({ id: opt.label }) }
    })
  }

  render() {
    const { recordsFiltered, orderBy, from, to, getLinkProps } = this.props
    const options = this.sortingOptions()

    return (
      <div className={`${VTEXClasses.HEADER_CLASS} flex flex-wrap justify-between`}>
        <div
          className={`${
            VTEXClasses.HEADER_SEARCH_CLASS
          } w-100 w-50-ns flex items-center justify-start pa3 ml7-l`}
        >
          <FormattedMessage id="search.text" values={{ from, to, recordsFiltered }} />
        </div>

        <div className="w-100 w-50-m w-20-l pa3">
          <Dropdown
            size="large"
            options={options}
            value={orderBy}
            onChange={(_, ordenation) => {
              const pagesArgs = getLinkProps(null, { orderBy: ordenation })
              this.context.navigate({
                page: pagesArgs.page,
                params: pagesArgs.params,
                query: pagesArgs.queryString,
                fallbackToWindowLocation: false,
              })
            }}
          />
        </div>
      </div>
    )
  }
}

export default injectIntl(SearchHeader)
