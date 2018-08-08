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
    selectedOptions: [],
  }

  handleOpen = id => e => {
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

  isOptionActive = opt => (
    !!this.state.selectedOptions.find(e => e.Name === opt.Name)
  )

  handleSelectOption = (e, option) => {
    e.preventDefault()

    if (!this.isOptionActive(option)) {
      this.setState({
        selectedOptions: [
          ...this.state.selectedOptions,
          option,
        ],
      })
    } else {
      this.setState({
        selectedOptions:
          this.state.selectedOptions.filter(opt => opt.Name !== option.Name),
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
              onOpen={this.handleOpen(filter.title)}
              onSelectOption={this.handleSelectOption}
              isOptionActive={this.isOptionActive}
            />
          )
        })}
      </div>
    )
  }
}
