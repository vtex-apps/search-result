import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import classNames from 'classnames'
import { uniqBy, pick } from 'ramda'
import Icon from 'vtex.use-svg/Icon'

import AccordionFilterItem from './AccordionFilterItem'

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
    const { filters, intl, filtersChecks, onFilterCheck, selectedFilters } = this.props
    const { openedItem } = this.state

    const nonEmptyFilters = filters.filter(spec => spec.options.length > 0)
    return (
      <div className="vtex-accordion-filter">
        <div className="vtex-filter-accordion__breadcrumbs pointer flex flex-row items-center pa5 bg-base w-100 z-max bb b--muted-4">
          <div className="pv4 flex items-center" onClick={() => this.setState({ openedItem: null })}>
            <div className={classNames('t-heading-4', {
              'c-muted-2': !!openedItem,
              'c-on-base': !openedItem })}>
              {intl.formatMessage({ id: 'search-result.filter-breadcrumbs.primary' })}
            </div>
          </div>
          {openedItem &&
          <div className="pa4 flex items-center">
            <Icon id="nav-angle--right" size="13" />
            <div className="pl3 t-heading-4 c-on-base">
              {intl.formatMessage({ id: openedItem })}
            </div>
          </div>
          }
        </div>

        {nonEmptyFilters.map(filter => {
          const { type, title, options } = filter
          const isOpen = openedItem === filter.title

          const filtersFlat = selectedFilters.filter(({ type: selectedType }) => selectedType === type)
          const filtersMerged = uniqBy(pick(['Name']), [...filtersFlat, ...options])
          return (
            <AccordionFilterItem
              key={filter.title}
              title={title}
              options={filtersMerged}
              filtersChecks={filtersChecks}
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
