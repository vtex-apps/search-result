import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import classNames from 'classnames'
import { IconCaret } from 'vtex.store-icons'

import { mountOptions } from '../constants/SearchHelpers'
import AccordionFilterItem from './AccordionFilterItem'

import searchResult from '../searchResult.css'

class AccordionFilterContainer extends Component {
  static propTypes = {
    /** Current available filters */
    filters: PropTypes.arrayOf(PropTypes.object),
    /** Intl instance */
    intl: intlShape,
    /** Filters mapped for checkbox */
    filtersChecks: PropTypes.object,
    /** Checkbox hit callback function */
    onFilterCheck: PropTypes.func,
    /** Filters selected previously */
    selectedFilters: PropTypes.array,
    isOptionSelected: PropTypes.func.isRequired,
    map: PropTypes.string.isRequired,
    rest: PropTypes.string.isRequired,
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
    const {
      filters,
      intl,
      onFilterCheck,
      map,
      rest,
      isOptionSelected,
    } = this.props
    const { openedItem } = this.state

    const nonEmptyFilters = filters.filter(spec => spec.options.length > 0)
    return (
      <div className={`${searchResult.accordionFilter} h-100`}>
        <div className={`${searchResult.filterAccordionBreadcrumbs} pointer flex flex-row items-center pa5 bg-base w-100 z-max bb b--muted-4`}>
          <div className="pv4 flex items-center" onClick={() => this.setState({ openedItem: null })}>
            <div className={classNames('t-heading-4', {
              'c-muted-2': !!openedItem,
              'c-on-base': !openedItem
            })}
            >
              {intl.formatMessage({ id: 'search-result.filter-breadcrumbs.primary' })}
            </div>
          </div>
          {openedItem && (
            <div className="pa4 flex items-center">
              <IconCaret orientation="right" size={13} />
              <div className="pl3 t-heading-4 c-on-base">
                {intl.formatMessage({ id: openedItem })}
              </div>
            </div>
          )}
        </div>

        {nonEmptyFilters.map(filter => {
          const { type, title, options } = filter
          const isOpen = openedItem === filter.title

          return (
            <AccordionFilterItem
              key={filter.title}
              title={title}
              options={mountOptions(options, type, map, rest)}
              isOptionSelected={isOptionSelected}
              open={isOpen}
              onFilterCheck={onFilterCheck}
              show={!openedItem || isOpen}
              onOpen={this.handleOpen(filter.title)}
            />
          )
        })}
      </div>
    )
  }
}

export default injectIntl(AccordionFilterContainer)
