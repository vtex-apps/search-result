import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { injectIntl, intlShape } from 'react-intl'
import { Dropdown } from 'vtex.styleguide'

import MaybeRenderPopup from './MaybeRenderPopup'

export const SORT_OPTIONS = [
  {
    value: 'OrderByTopSaleDESC',
    label: 'ordenation.sales',
  },
  {
    value: 'OrderByReleaseDateDESC',
    label: 'ordenation.release.date',
  },
  {
    value: 'OrderByBestDiscountDESC',
    label: 'ordenation.discount',
  },
  {
    value: 'OrderByPriceDESC',
    label: 'ordenation.price.descending',
  },
  {
    value: 'OrderByPriceASC',
    label: 'ordenation.price.ascending',
  },
  {
    value: 'OrderByNameASC',
    label: 'ordenation.name.ascending',
  },
  {
    value: 'OrderByNameDESC',
    label: 'ordenation.name.descending',
  },
]

/**
 * Displays the header information of the Gallery: the query used to find the products and a selector to choose the sorting type.
 */
class OrderBy extends Component {
  static contextTypes = {
    navigate: PropTypes.func,
  }

  static propTypes = {
    /** Wich sorting option is selected. */
    orderBy: PropTypes.string.isRequired,
    /** Returns the link props. */
    getLinkProps: PropTypes.func,
    /** Intl instance. */
    intl: intlShape,
  }

  get sortingOptions() {
    return SORT_OPTIONS.map(opt => {
      return {
        value: opt.value,
        label: this.props.intl.formatMessage({ id: opt.label }),
      }
    })
  }

  render() {
    const { orderBy, getLinkProps } = this.props

    return (
      <MaybeRenderPopup
        title="Ordernar"
        isMobile={false}
        id="orderby"
      >
        <Dropdown
          size="large"
          options={this.sortingOptions}
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
      </MaybeRenderPopup>
    )
  }
}

export default injectIntl(OrderBy)
