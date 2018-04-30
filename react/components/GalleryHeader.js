import React from 'react'
import PropTypes from 'prop-types'
import Dropdown from '@vtex/styleguide/lib/Dropdown'
import VTEXClasses from '../utils/css-classes'

import { FormattedMessage, injectIntl } from 'react-intl'

/**
 * Displays the header information of the Gallery: the query used to find the products and a selector to choose the sorting type.
 */
class GalleryHeader extends React.Component {
  sortingOptions() {
    const context = this.context

    return this.props.sortingOptions.map(el => {
      return { value: el, label: context.intl.formatMessage({ id: el }) }
    })
  }

  render() {
    const { quantity, search, selectedSort, onSortChange } = this.props
    const options = this.sortingOptions()

    return (
      <div
        className={`${
          VTEXClasses.HEADER_CLASS
        } flex flex-wrap justify-between mb7`}
      >
        <div
          className={`${
            VTEXClasses.HEADER_SEARCH_CLASS
          } w-third-l w-third-m w-100-s pa3 pt5`}
        >
          <FormattedMessage id="search.text" values={{ search }} />
        </div>
        <div
          className={`${
            VTEXClasses.HEADER_ORDER_RESULTS_CLASS
          } w-third-l w-third-m w-100-s pa3 pt5`}
        >
          <FormattedMessage
            id="sortBy.text"
            values={{
              quantity,
            }}
          />
        </div>
        <div className="w-20-l w-20-m w-100-s pa3">
          <Dropdown
            size="large"
            options={options}
            value={options[selectedSort].value}
            onChange={onSortChange}
          />
        </div>
      </div>
    )
  }
}

GalleryHeader.contextTypes = {
  intl: PropTypes.object.isRequired,
}

GalleryHeader.propTypes = {
  /** Amount of products displayed by the gallery. */
  quantity: PropTypes.number.isRequired,
  /** Query used to find the products. */
  search: PropTypes.string.isRequired,
  /** Function that will be called when the user change the sorting method. */
  onSortChange: PropTypes.func.isRequired,
  /** Wich sorting method is selected. */
  selectedSort: PropTypes.number.isRequired,
  /** List of sorting methods. */
  sortingOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default injectIntl(GalleryHeader)
