import { FormattedMessage } from 'react-intl'
import React from 'react'
import PropTypes from 'prop-types'

import searchResult from './searchResult.css'

const TotalProducts = ({ recordsFiltered }) => {
  return (
      <div className={`${searchResult.totalProducts} pv5 bn-ns bt-s b--muted-4 tc-s tl`}>
        <FormattedMessage id="search.total-products" values={{ recordsFiltered }}>
          {txt => <span className="ph4 c-muted-2">{txt}</span>}
        </FormattedMessage>
      </div>
  )
}

TotalProducts.propTypes = {
  /** Total of records filtered */
  recordsFiltered: PropTypes.number,
}

export default TotalProducts