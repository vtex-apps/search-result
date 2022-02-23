import PropTypes from 'prop-types'
import React, { useMemo } from 'react'
import { useIntl } from 'react-intl'

import SelectionListOrderBy from './components/SelectionListOrderBy'

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

const OrderBy = ({
  orderBy,
  message,
  specificationOptions = [],
  hiddenOptions = [],
  showOrderTitle = true,
}) => {
  const intl = useIntl()

  const sortingOptions = useMemo(() => {
    return SORT_OPTIONS.concat(specificationOptions).filter(
      (option) => !hiddenOptions.includes(option.value) && option.label
    ).map(({ value, label }) => {
      return {
        value,
        label: intl.formatMessage({ id: label }),
      }
    })
  }, [intl, hiddenOptions, specificationOptions])

  return (
    <SelectionListOrderBy
      orderBy={orderBy}
      message={message}
      options={sortingOptions}
      showOrderTitle={showOrderTitle}
    />
  )
}

OrderBy.propTypes = {
  /** Which sorting option is selected. */
  orderBy: PropTypes.string,
  /** Specification sorting options to be displayed in the list */
  specificationOptions: PropTypes.arrayOf(PropTypes.object),
  /** Options to be hidden. (e.g. `["OrderByNameASC", "OrderByNameDESC"]`) */
  hiddenOptions: PropTypes.arrayOf(PropTypes.string),
  /** Message to be displayed */
  message: PropTypes.string,
  /** Show or hide order title */
  showOrderTitle: PropTypes.bool,
}

export default OrderBy
