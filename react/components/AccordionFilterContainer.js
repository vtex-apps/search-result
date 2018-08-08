import React, { Component } from 'react'
import PropTypes from 'prop-types'

import AccordionFilterItem from './AccordionFilterItem'
import { facetOptionShape } from '../constants/propTypes'

export default class AccordionFilterContainer extends Component {
  static propTypes = {
    filters: PropTypes.arrayOf(facetOptionShape),
  }

  state = {
    openedItem: null,
  }

  handleClick = id => e => {
    e.preventDefault()

    if (this.state.openedItem === id) {
      this.setState({
        openedItem: null,
      })
    } else {
      this.setState({
        openedItem: id,
      })
    }
  }

  render() {
    const { filters } = this.props
    const { openedItem } = this.state

    return (
      <div className="vtex-accordion-filter">
        {filters.map(filter => {
          const isOpen = openedItem === filter.title

          return (
            <AccordionFilterItem
              key={filter.title}
              filter={filter}
              open={isOpen}
              show={openedItem === null ? true : isOpen}
              onClick={this.handleClick(filter.title)}
            />
          )
        })}
      </div>
    )
  }
}
