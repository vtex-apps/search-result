import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Dropdown } from 'vtex.styleguide'
import { ExtensionPoint } from 'render'

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
      return {
        value: opt.value,
        label: context.intl.formatMessage({ id: opt.label }),
      }
    })
  }

  render() {
    const { recordsFiltered, orderBy, from, to, getLinkProps } = this.props // eslint-disable-line no-unused-vars
    const options = this.sortingOptions()

    return (
      <div className="vtex-search-result__header flex flex-wrap justify-between">
        <div className="vtex-search-result__header-search">
          {/* <ExtensionPoint id="breadcrumb" /> */}
        </div>

        <div className="flex items-center">
          <FormattedMessage
            id="search.total-products"
            values={{ recordsFiltered }}
          >
            {txt => <span className="ph4 black-50">{txt}</span>}
          </FormattedMessage>
          <Dropdown
            size="large"
            options={options}
            value={orderBy}
            onChange={(_, ordenation) => {
              const pagesArgs = getLinkProps({ ordenation })
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
