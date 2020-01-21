import { FormattedMessage } from 'react-intl'
import React from 'react'
import PropTypes from 'prop-types'
import { useCssHandles } from 'vtex.css-handles'

import styles from './searchResult.css'

const CSS_HANDLES = ['totalProductsMessage']

const TotalProducts = ({
  recordsFiltered,
  wrapperClass = styles.totalProducts,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  return (
    <div
      className={`${wrapperClass} pv5 ph9 bn-ns bt-s b--muted-5 tc-s tl t-action--small`}
    >
      <FormattedMessage
        tagName="span"
        id="store/search.total-products-2"
        values={{
          recordsFiltered,
          // eslint-disable-next-line react/display-name
          span: (...chunks) => (
            <span className={`${handles.totalProductsMessage} c-muted-2`}>
              {chunks}
            </span>
          ),
        }}
      />
    </div>
  )
}

TotalProducts.propTypes = {
  /** Total of records filtered */
  recordsFiltered: PropTypes.number.isRequired,
  wrapperClass: PropTypes.string,
}

export default TotalProducts
