import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Collapse } from 'react-collapse'
import classNames from 'classnames'

import Arrow from '../images/Arrow'

import searchResult from '../searchResult.css'

/**
 * Collapsable filters container
 */
export default class FilterOptionTemplate extends Component {
  static propTypes = {
    /** Content class names */
    className: PropTypes.string,
    /** Filters to be shown, if no filter is provided, treat the children as simple node */
    filters: PropTypes.arrayOf(PropTypes.object),
    /** Function to handle filter rendering or node if no filter is provided */
    children: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.node,
    ]).isRequired,
    /** Title */
    title: PropTypes.string.isRequired,
    /** Whether collapsing is enabled */
    collapsable: PropTypes.bool,
    /** Whether it represents the selected filters */
    selected: PropTypes.bool,
  }

  static defaultProps = {
    collapsable: true,
    selected: false,
  }

  state = {
    open: true,
  }

  renderChildren() {
    const { filters, children } = this.props

    if (typeof children !== 'function') {
      return children
    }

    return filters.map(children)
  }

  render() {
    const { selected, title, collapsable, children, filters } = this.props
    const { open } = this.state

    // Backward-compatible support
    if (typeof children === 'function' && !filters.length) {
      return null
    }

    const className = classNames('vtex-search-result__filter pv3 bb b--muted-4', {
      [searchResult.filterSelected]: selected,
      [searchResult.filterAvailable]: !selected,
    })

    const titleClassName = classNames(`${searchResult.filterTitle} t-heading-7 flex items-center justify-between`, {
      'ttu': selected,
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
              <span className={searchResult.filterIcon} style={{ height: 10 }}>
                <Arrow up={open} />
              </span>
            )}
          </div>
        </div>
        <div
          className={classNames(
            this.props.className,
            'pt2',
            {
              'overflow-y-auto': collapsable,
            }
          )}
          style={{ maxHeight: '200px' }}
        >
          {collapsable ? (
            <Collapse isOpened={open}>
              {this.renderChildren()}
            </Collapse>
          ) : this.renderChildren()}
        </div>
      </div>
    )
  }
}
