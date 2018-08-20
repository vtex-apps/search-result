import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Collapse } from 'react-collapse'
import classNames from 'classnames'

import Arrow from '../images/Arrow'

export default class FilterOptionTemplate extends Component {
  static propTypes = {
    filters: PropTypes.arrayOf(PropTypes.object).isRequired,
    children: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    collapsable: PropTypes.bool,
    selected: PropTypes.bool,
  }

  static defaultProps = {
    collapsable: true,
    selected: false,
  }

  state = {
    open: true,
  }

  render() {
    const { selected, children, filters, title, collapsable } = this.props
    const { open } = this.state

    if (!filters.length) {
      return null
    }

    const className = classNames('vtex-search-result__filter pv3 bb b--light-gray', {
      'vtex-search-result__filter--selected': selected,
      'vtex-search-result__filter--available': !selected,
    })

    const titleClassName = classNames('vtex-search-result__filter-title f6 flex items-center justify-between', {
      'ttu': !collapsable,
    })

    return (
      <div className={className}>
        <div
          className={collapsable ? 'pointer' : ''}
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
