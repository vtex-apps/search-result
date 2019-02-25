import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { injectIntl, intlShape } from 'react-intl'
import { Dropdown } from 'vtex.styleguide'
import { withRuntimeContext } from 'vtex.render-runtime'

import SelectionListOrderBy from './components/SelectionListOrderBy'
import { HEADER_SCROLL_OFFSET } from './constants/SearchHelpers'

import searchResult from './searchResult.css'

export const SORT_OPTIONS = [
  {
    value: '',
    label: 'ordenation.sort-by',
  },
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
    const { orderBy, getLinkProps, runtime: { hints: { mobile } }, runtime } = this.props

    if (mobile) {
      return (
        <div className={searchResult.orderBy}>
          <SelectionListOrderBy
            orderBy={orderBy}
            getLinkProps={getLinkProps}
            options={this.sortingOptions}
          />
        </div>
      )
    }

    return (
      <div className={searchResult.orderBy}>
        <Dropdown
          size="large"
          options={this.sortingOptions}
          value={orderBy}
          onChange={(_, ordenation) => {
            const { page, params, queryString } = getLinkProps({ ordenation })
            runtime.navigate({
              page: page,
              params: params,
              query: queryString,
              fallbackToWindowLocation: false,
              scrollOptions: { baseElementId: 'search-result-anchor', top: -HEADER_SCROLL_OFFSET },
            })
          }}
        />
      </div>
    )
  }
}

export default withRuntimeContext(injectIntl(OrderBy))
