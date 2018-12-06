import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import classNames from 'classnames'

import AccordionFilterItem from './AccordionFilterItem'
import { mountOptions } from '../constants/SearchHelpers'
import Icon from "vtex.use-svg/Icon"

class AccordionFilterContainer extends Component {
  static propTypes = {
    /** Current available filters */
    filters: PropTypes.arrayOf(PropTypes.object),
    /** Rest query parameter */
    rest: PropTypes.string,
    /** Map query parameter */
    map: PropTypes.string,
    /** Get the props to pass to render's Link */
    getLinkProps: PropTypes.func,
    /** Intl instance */
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
    const { filters, intl, getLinkProps, map, rest, filtersChecks, handleFilterCheck, } = this.props
    const { openedItem } = this.state

    const nonEmptyFilters = filters.filter(spec => spec.options.length > 0)

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
          const { type, title, options, oneSelectedCollapse } = filter
          const isOpen = openedItem === filter.title
          return (
            <AccordionFilterItem
              key={filter.title}
              type={type}
              title={title}
              options={mountOptions(options, type, map, rest)}
              filtersChecks={filtersChecks}
              open={isOpen}
              handleFilterCheck={handleFilterCheck}
              show={openedItem === null ? true : isOpen}
              onOpen={this.handleOpen(filter.title)}
              oneSelectedCollapse={oneSelectedCollapse}
              getLinkProps={getLinkProps}
            />
          )
        })}
      </div>
    )
  }
}

export default injectIntl(AccordionFilterContainer)
