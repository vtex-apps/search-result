import { FormattedMessage } from 'react-intl'
import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import searchResult from './searchResult.css'

const TotalProducts = ({ recordsFiltered }) => {
  return (
    <Fragment>
      <div className={`${searchResult.totalProducts} pv5 bn-ns bt-s b--muted-4 tc-s tl`}>
        <FormattedMessage
          id="search.total-products"
          values={{ recordsFiltered }}
        >
          {txt => <span className="ph4 c-muted-2">{txt}</span>}
        </FormattedMessage>
      </div>
    </Fragment>
  )
}

TotalProducts.propTypes = {
  /** Total of records filtered */
  recordsFiltered: PropTypes.string.recordsFiltered,
}

export default TotalProducts