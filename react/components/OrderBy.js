import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { injectIntl, intlShape } from 'react-intl'
import { isMobile } from 'react-device-detect'
import { Dropdown } from 'vtex.styleguide'
import { NoSSR } from 'render'

import MobileOrderBy from './MobileOrderBy'

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

    if (isMobile) {
      return (
        <NoSSR onSSR={null}>
          <MobileOrderBy
            orderBy={orderBy}
            getLinkProps={getLinkProps}
            options={this.sortingOptions}
          />
        </NoSSR>
      )
    }

    return (
      <NoSSR onSSR={null}>
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
      </NoSSR>
    )
  }
}

export default injectIntl(OrderBy)
