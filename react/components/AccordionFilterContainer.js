import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'render'
import { injectIntl, intlShape } from 'react-intl'

import Popup from './Popup'
import FooterButton from './FooterButton'
import AccordionFilterItem from './AccordionFilterItem'
import { facetOptionShape } from '../constants/propTypes'

class AccordionFilterContainer extends Component {
  static propTypes = {
    filters: PropTypes.arrayOf(facetOptionShape),
    intl: intlShape,
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

  handleClean = e => {
    e.preventDefault()

    this.setState({
      selectedOptions: [],
    })
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
    const { filters, intl } = this.props
    const { openedItem } = this.state

    return (
      <Popup
        title={intl.formatMessage({ id: 'search-result.filter-button.title' })}
        id="filters"
        footer={
          <div className="flex justify-between pv3 ph6">
            <FooterButton onClick={this.handleClean}>Limpar</FooterButton>
            <vr className="bg-white" style={{ width: 1 }} />
            <Link>
              <FooterButton onClick={e => e.preventDefault()}>Filtrar</FooterButton>
            </Link>
          </div>
        }
      >
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
      </Popup>
    )
  }
}

export default injectIntl(AccordionFilterContainer)
