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

const Grow = ({ children, className, by }) => (
  <span className={className} style={{ flexGrow: by }}>
    {children}
  </span>
)

const Border = () => <span className="bg-muted-4 pl1 h-50 self-center" />

const FlexLayout = ({
  mobile,
  breadcrumb,
  totalProducts,
  orderBy,
  hideFacets,
  filterNavigator,
  gallery,
  layoutModeSwitcher,
}) => {
  return mobile ? (
    <Fragment>
      <Row className="bb bw1 b--muted-4">
        <Grow by={3}>{orderBy}</Grow>
        <Border />
        <Grow by={2}>{filterNavigator}</Grow>
        <Border />
        <Grow by={1}>{layoutModeSwitcher}</Grow>
      </Row>
      <Row>{gallery}</Row>
    </Fragment>
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
