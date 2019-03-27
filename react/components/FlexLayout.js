import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const Row = ({ className, justify, items, children }) => {
  const rowClasses = classNames(
    'flex',
    className,
    justify && `justify-${justify}`,
    items && `items-${justify}`
  )
  return <div className={rowClasses}>{children}</div>
}

Row.PropTypes = {
  className: PropTypes.string,
  justify: PropTypes.oneOf(['between', 'around', 'center']),
  items: PropTypes.oneOf(['start', 'center', 'end']),
}

const RowSpacer = () => <div style={{ flexGrow: 2 }} />

const FlexLayout = ({
  mobile,
  breadcrumb,
  totalProducts,
  orderBy,
  hideFacets,
  filterNavigator,
  gallery,
}) => {
  return mobile ? (
    <h1>Mobile</h1>
  ) : (
    <Fragment>
      <Row justify="between">
        {breadcrumb}
        <RowSpacer />
        {totalProducts}
        <span className="w5">{orderBy}</span>
      </Row>
      <Row className="w-100">
        {!hideFacets && <div className="w5">{filterNavigator}</div>}
        {gallery}
      </Row>
    </Fragment>
  )
}

FlexLayout.propTypes = {
  mobile: PropTypes.bool,
  breadcrumb: PropTypes.element,
  totalProducts: PropTypes.element,
  orderBy: PropTypes.element,
  hideFacets: PropTypes.element,
  filterNavigator: PropTypes.element,
  gallery: PropTypes.element,
}

export default FlexLayout
