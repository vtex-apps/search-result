import PropTypes from 'prop-types'
import React, { useMemo } from 'react'
import { injectIntl, intlShape } from 'react-intl'

import SelectionListOrderBy from './components/SelectionListOrderBy'

import styles from './searchResult.css'

export const SORT_OPTIONS = [
  {
    value: '',
    label: 'store/ordenation.relevance',
  },
  {
    value: 'OrderByTopSaleDESC',
    label: 'store/ordenation.sales',
  },
  {
    value: 'OrderByReleaseDateDESC',
    label: 'store/ordenation.release.date',
  },
  {
    value: 'OrderByBestDiscountDESC',
    label: 'store/ordenation.discount',
  },
  {
    value: 'OrderByPriceDESC',
    label: 'store/ordenation.price.descending',
  },
  {
    value: 'OrderByPriceASC',
    label: 'store/ordenation.price.ascending',
  },
  {
    value: 'OrderByNameASC',
    label: 'store/ordenation.name.ascending',
  },
  {
    value: 'OrderByNameDESC',
    label: 'store/ordenation.name.descending',
  },
]

const OrderBy = ({ orderBy, wrapperClass = styles.orderBy, intl }) => {
  const sortingOptions = useMemo(() => {
    return SORT_OPTIONS.map(({ value, label }) => {
      return {
        value: value,
        label: intl.formatMessage({ id: label }),
      }
    })
  }, [intl])

  return (
    <div className={wrapperClass}>
      <SelectionListOrderBy orderBy={orderBy} options={sortingOptions} />
    </div>
  )
}

OrderBy.propTypes = {
  /** Which sorting option is selected. */
  orderBy: PropTypes.string,
  /** Intl instance. */
  intl: intlShape,
}

export default injectIntl(OrderBy)
