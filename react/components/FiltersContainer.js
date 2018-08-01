import PropTypes from 'prop-types'
import React, { Component } from 'react'
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

    const titleClassName = classNames('f6 flex items-center justify-between', {
      'ttu': !collapsable,
    })

    return (
      <div className="vtex-search-result__filter pv3 bb b--light-gray">
        <div
          className="pointer"
          onClick={() => {
            this.setState({ open: !open })
          }}
        >
          <div className={titleClassName}>
            {title}
            {collapsable && (
              <span className="vtex-search-result__filter-icon" style={{ height: 10 }}>
                <Arrow up={open} />
              </span>
            )}
          </div>
        </div>
        <div className="pt2" style={{ overflowY: 'auto', maxHeight: '200px' }}>
          {collapsable ? (
            <Collapse isOpened={open}>
              {filters.map(children)}
            </Collapse>
          ) : filters.map(children)}
        </div>
      </div>
    )
  }
}
