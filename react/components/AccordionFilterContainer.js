import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import classNames from 'classnames'
import { uniqBy, pick } from 'ramda'

import AccordionFilterItem from './AccordionFilterItem'
import { mountOptions } from '../constants/SearchHelpers'
import Icon from "vtex.use-svg/Icon"

class AccordionFilterContainer extends Component {
  static propTypes = {
    /** Current available filters */
    filters: PropTypes.arrayOf(PropTypes.object),
    /** Intl instance */
    intl: intlShape,
    /** Filters mapped for checkbox */
    filtersChecks: PropTypes.object,
    /** Checkbox hit callback function */
    handleFilterCheck: PropTypes.func,
    /** Filters selected previously */
    selectedFilters: PropTypes.array
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
    const { filters, intl, filtersChecks, handleFilterCheck, selectedFilters } = this.props
    const { openedItem } = this.state

    let nonEmptyFilters = filters.filter(spec => spec.options.length > 0)
    return (
      <div className="vtex-accordion-filter">
        <div className="pointer flex flex-row items-center pa5 h3 bg-base w-100 z-max bb b--muted-3 bw1">
          <div className="c-muted-1 pv4 flex items-center" onClick={e => this.setState({ openedItem: null, })}>
            <div className={classNames("t-heading-6", { "b": !openedItem})}>
              {intl.formatMessage({ id: "search-result.filter-breadcrumbs.primary" })}
            </div>
          </div>
          {openedItem && 
          <div className="c-muted-1 pa4 flex items-center">
              <Icon id="nav-angle--right" size="13"/>
              <div className="pl3 t-heading-6 b">
                {intl.formatMessage({ id: openedItem })}
              </div>
          </div>
        }
        </div>
        
        {nonEmptyFilters.map(filter => {
          const { type, title, options } = filter
          const isOpen = openedItem === filter.title
          
          const filtersFlat = selectedFilters.filter(({type: selectedType}) => selectedType === type)
          const filtersFull = uniqBy(pick(['Name']), [...filtersFlat, ...options])
          return (
            <AccordionFilterItem
              key={filter.title}
              title={title}
              options={filtersFull}
              filtersChecks={filtersChecks}
              open={isOpen}
              handleFilterCheck={handleFilterCheck}
              show={openedItem === null ? true : isOpen}
              onOpen={this.handleOpen(filter.title)}
            />
          )
        })}
      </div>
    )
  }
}

export default injectIntl(AccordionFilterContainer)
