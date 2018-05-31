import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'

import Dropdown from '@vtex/styleguide/lib/Dropdown'
import VTEXClasses from '../constants/CSSClasses'

/**
 * Displays the header information of the Gallery: the query used to find the products and a selector to choose the sorting type.
 */
class SearchHeader extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired,
  }

  static propTypes = {
    /** Amount of products filtered. */
    recordsFiltered: PropTypes.number.isRequired,
    from: PropTypes.number,
    to: PropTypes.number,
    headerText: PropTypes.string.isRequired,
    /** Function that will be called when the user change the sorting method. */
    onSortChange: PropTypes.func.isRequired,
    /** Wich sorting method is selected. */
    selectedSort: PropTypes.string.isRequired,
    /** List of sorting methods. */
    sortingOptions: PropTypes.array.isRequired,
  }

  sortingOptions() {
    const context = this.context
    return this.props.sortingOptions.map(opt => {
      return { value: opt.value, label: context.intl.formatMessage({ id: opt.label }) }
    })
  }

  render() {
    const { recordsFiltered, headerText, selectedSort, onSortChange, from, to } = this.props
    const options = this.sortingOptions()

    return (
      <div
        className={`${
          VTEXClasses.HEADER_CLASS
        } flex flex-wrap justify-between`}
      >
        <div
          className={`${
            VTEXClasses.HEADER_SEARCH_CLASS
          } w-third-l w-third-m w-100-s flex items-center pa3 ml5`}
        >
          Showing {from}-{to} from {recordsFiltered} records
          {/* <FormattedMessage id="search.text" values={{ search: headerText }} /> */}
        </div>

        <div className="w-20-l w-20-m w-100-s pa3">
          <Dropdown
            size="large"
            options={options}
            value={selectedSort}
            onChange={(a, b) => {
              onSortChange(b)
            }}
          />
        </div>
      </div>
    )
  }
}

export default injectIntl(SearchHeader)
