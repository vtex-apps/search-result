import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { injectIntl, intlShape } from 'react-intl'
import { Dropdown } from 'vtex.styleguide'
import { withRuntimeContext } from 'vtex.render-runtime'
import classNames from 'classnames'

import SelectionListOrderBy from './components/SelectionListOrderBy'
import { HEADER_SCROLL_OFFSET } from './constants/SearchHelpers'

import searchResult from './searchResult.css'

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
    orderBy: PropTypes.string,
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
    return SORT_OPTIONS.map(({ value, label }) => {
      return {
        value: value,
        label: this.props.intl.formatMessage({ id: label }),
      }
    })
  }

  render() {
    const { orderBy, getLinkProps, runtime: { hints: { mobile } } } = this.props

    const orderbyClasses = classNames(searchResult.orderBy, {
      'flex justify-end': mobile
    })

    return (
      <div className={orderbyClasses}>
        <SelectionListOrderBy
          mobile={mobile}
          orderBy={orderBy}
          getLinkProps={getLinkProps}
          options={this.sortingOptions}
        />
      </div>
    )
  }
}

export default withRuntimeContext(injectIntl(OrderBy))
