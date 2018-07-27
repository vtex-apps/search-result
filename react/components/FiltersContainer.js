import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Collapse } from 'react-collapse'

import ArrowDown from '../images/arrow-down.svg'
import ArrowUp from '../images/arrow-up.svg'

export default class FiltersContainer extends Component {
  static propTypes = {
    filters: PropTypes.arrayOf(PropTypes.object).isRequired,
    children: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
  }

  state = {
    open: true,
  }

  render() {
    const { children, filters, title } = this.props
    const { open } = this.state

    return (
      <div className="vtex-search-result__filter ph4 pt4 pb2 bb b--light-gray">
        <div
          className="pointer mb4"
          onClick={() => {
            this.setState({ open: !open })
          }}
        >
          <div className="f4">
            {title}
            <span className="vtex-search-result__filter-icon fr">
              <img src={open ? ArrowUp : ArrowDown} width={20} />
            </span>
          </div>
        </div>

        <div style={{ overflowY: 'auto', maxHeight: '200px' }}>
          <Collapse isOpened={open}>
            <div className="w-90 db">
              {filters.map(children)}
            </div>
          </Collapse>
        </div>
      </div>
    )
  }
}
