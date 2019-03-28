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

const Item = ({ children, className, grow = 0, inline }) => {
  const props = { className: className, style: { flexGrow: grow } }

  return !!inline ? (
    <span {...props}>{children}</span>
  ) : (
    <div {...props}>{children}</div>
  )
}

const Border = () => <Item inline className="bg-muted-4 pl1 h-50 self-center" />

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
        <Item inline grow={3}>
          {orderBy}
        </Item>
        <Border />
        <Item inline grow={2}>
          {filterNavigator}
        </Item>
        <Border />
        <Item grow={1} inline>
          {layoutModeSwitcher}
        </Item>
      </Row>
      <Row>{gallery}</Row>
    </Fragment>
  ) : (
    <Fragment>
      <Row justify="between">
        {breadcrumb}
        <Item grow={2} />
        {totalProducts}
        <Item inline className="w5">
          {orderBy}
        </Item>
      </Row>
      <Row className="w-100">
        {!hideFacets && <Item className="w5">{filterNavigator}</Item>}
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
