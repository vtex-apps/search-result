import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import { Collapse } from 'react-collapse'
import classNames from 'classnames'

import Arrow from '../images/Arrow'

export default class FiltersContainer extends Component {
  static propTypes = {
    filters: PropTypes.arrayOf(PropTypes.object).isRequired,
    children: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    collapsable: PropTypes.bool,
  }

  static defaultProps = {
    collapsable: true,
  }

  state = {
    open: true,
  }

  render() {
    const { children, filters, title, collapsable } = this.props
    const { open } = this.state

    const CollapseComponent = collapsable ? Collapse : Fragment

    const titleClassName = classNames('f6', {
      'ttu': !collapsable,
    })

    return (
      <div className="vtex-search-result__filter ph4 pt4 pb2 bb b--light-gray">
        <div
          className="pointer mb4"
          onClick={() => {
            this.setState({ open: !open })
          }}
        >
          <div className={titleClassName}>
            {title}
            {collapsable && <span className="vtex-search-result__filter-icon fr">
              <Arrow up={open} />
            </span>}
          </div>
        </div>

        <div style={{ overflowY: 'auto', maxHeight: '200px' }}>
          <CollapseComponent isOpened={open}>
            <div className="w-90 db">
              {filters.map(children)}
            </div>
          </CollapseComponent>
        </div>
      </div>
    )
  }
}
