import React from 'react'
import PropTypes from 'prop-types'
import Dropdown from '@vtex/styleguide/lib/Dropdown'
import VTEXClasses from '../utils/css-classes'

import { FormattedMessage, injectIntl } from 'react-intl'

class GalleryHeader extends React.Component {
  sortingOptions() {
    const sortingOptions = [
      'sortBy.relevance',
      'sortBy.higherPrice',
      'sortBy.lowerPrice',
      'sortBy.nameAZ',
      'sortBy.nameZA',
      'sortBy.bestSellers',
    ]

    const context = this.context

    return sortingOptions.map(el => {
      return { value: el, label: context.intl.formatMessage({ id: el }) }
    })
  }

  render() {
    const { quantity, query } = this.props
    const options = this.sortingOptions()

    return (
      <div className="flex flex-wrap justify-between mb7">
        <div
          className={`${
            VTEXClasses.HEADER_SEARCH_CLASS
          } w-third-l w-third-m w-100-s pa3 pt5`}
        >
          <FormattedMessage id="search.text" values={{ query }} />
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
          <Dropdown size="large" options={options} value={options[0].value} />
        </div>
      </div>
    )
  }
}

GalleryHeader.contextTypes = {
  intl: PropTypes.object.isRequired,
}

GalleryHeader.propTypes = {
  /** Amount of products displayed by the gallery */
  quantity: PropTypes.number.isRequired,
  /** Graphql data response. */
  query: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }),
}

export default injectIntl(GalleryHeader)
