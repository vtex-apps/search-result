import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'

import Popup from './Popup'
import AccordionFilterItem from './AccordionFilterItem'
import { mountOptions } from '../constants/SearchHelpers'

class AccordionFilterContainer extends Component {
  static propTypes = {
    filters: PropTypes.arrayOf(PropTypes.object),
    getLinkProps: PropTypes.func,
    rest: PropTypes.string,
    map: PropTypes.string,
    intl: intlShape,
  }

  state = {
    openedItem: null,
  }

  handleItemSelected = onClose => e => {
    onClose(e)

    this.setState({
      openedItem: null,
    })
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

  render() {
    const { filters, intl, getLinkProps, map, rest } = this.props
    const { openedItem } = this.state

    const nonEmptyFilters = filters.filter(spec => spec.options.length > 0)

    return (
      <Popup
        title={intl.formatMessage({ id: 'search-result.filter-button.title' })}
        id="filters"
      >
        {({ onClose }) => (
          <div className="vtex-accordion-filter">
            {nonEmptyFilters.map(filter => {
              const { type, title, options, oneSelectedCollapse } = filter
              const isOpen = openedItem === filter.title

              return (
                <AccordionFilterItem
                  key={filter.title}
                  type={type}
                  title={title}
                  options={mountOptions(options, type, map, rest)}
                  open={isOpen}
                  show={openedItem === null ? true : isOpen}
                  onOpen={this.handleOpen(filter.title)}
                  onItemSelected={this.handleItemSelected(onClose)}
                  oneSelectedCollapse={oneSelectedCollapse}
                  getLinkProps={getLinkProps}
                />
              )
            })}
          </div>
        )}
      </Popup>
    )
  }
}

export default injectIntl(AccordionFilterContainer)
