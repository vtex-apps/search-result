/* global __RUNTIME__ */
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { injectIntl, intlShape } from 'react-intl'
import { Dropdown } from 'vtex.styleguide'
import { withRuntimeContext } from 'render'

import SelectionListOrderBy from './SelectionListOrderBy'

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
  static propTypes = {
    /** Which sorting option is selected. */
    orderBy: PropTypes.string.isRequired,
    /** Returns the link props. */
    getLinkProps: PropTypes.func,
    /** Intl instance. */
    intl: intlShape,
    /** Render Runtime context */
    runtime: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
    }).isRequired,
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
    const { orderBy, getLinkProps, runtime } = this.props

    if (__RUNTIME__.hints.mobile) {
      return (
        <SelectionListOrderBy
          orderBy={orderBy}
          getLinkProps={getLinkProps}
          options={this.sortingOptions}
        />
      )
    }

    return (
      <Dropdown
        size="large"
        options={this.sortingOptions}
        value={orderBy}
        onChange={(_, ordenation) => {
          const pagesArgs = getLinkProps({ ordenation })
          runtime.navigate({
            page: pagesArgs.page,
            params: pagesArgs.params,
            query: pagesArgs.queryString,
            fallbackToWindowLocation: false,
          })
        }}
      />
    )
  }
}

export default withRuntimeContext(injectIntl(OrderBy))
