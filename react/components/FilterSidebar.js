import classNames from 'classnames'
import PropTypes from 'prop-types'
import {
  map as mapRamda,
  flatten,
  filter,
  pipe,
} from 'ramda'
import React, { Component, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'
import { withRuntimeContext, Link } from 'render'
import { Button } from 'vtex.styleguide'

import { facetOptionShape } from '../constants/propTypes'
import { mountOptions } from '../constants/SearchHelpers'
import FilterIcon from '../images/FilterIcon'
import AccordionFilterContainer from './AccordionFilterContainer'
import Sidebar from './SideBar'

class FilterSidebar extends Component {
  static propTypes = {
    map: PropTypes.string.isRequired,
    rest: PropTypes.string.isRequired,
    getLinkProps: PropTypes.func.isRequired,
    runtime: PropTypes.object.isRequired,
    filters: PropTypes.arrayOf(facetOptionShape).isRequired,
    selectedFilters: PropTypes.arrayOf(facetOptionShape).isRequired,
  }

  state = {
    openContent: false,
    selectedFilters: pipe(
      mapRamda(filter =>
        mountOptions(filter.options, filter.type, this.props.map, this.props.rest),
      ),
      flatten,
      filter(option => option.selected),
      mapRamda(option => ({
        ...option,
        link: option.Link,
      }))
    )(this.props.filters || []),
  }

  handleFilterCheck = filter => {
    if (!this.isOptionSelected(filter)) {
      this.setState({
        selectedFilters: this.state.selectedFilters.concat({...filter, link: filter.Link}),
      })
    } else {
      this.setState({
        selectedFilters: this.state
          .selectedFilters
          .filter(opt => opt.slug !== filter.slug),
      })
    }
  }

  handleClose = () => {
    document.body.style.overflow = 'visible'
    this.setState({
      openContent: false,
    })
  }

  handleOpen = () => {
    document.body.style.overflow = 'hidden'
    this.setState({
      openContent: true,
    })
  }

  isOptionSelected = opt => (
    !!this.state.selectedFilters.find(o => o.slug === opt.slug)
  )

  handleClearFilters = () => {
    const { getLinkProps, runtime: { navigate } } = this.props

    this.setState({ selectedFilters: [] })
    const pagesArgs = getLinkProps([])

    const options = {
      page: pagesArgs.page,
      params: pagesArgs.params,
      query: pagesArgs.queryString,
    }

    navigate(options)
  }

  render() {
    const { openContent, selectedFilters } = this.state
    const {
      filters,
      map,
      rest,
      getLinkProps,
    } = this.props

    const pagesArgs = getLinkProps(mapRamda(opt => ({ ...opt, isSelected: false}) , selectedFilters), true)

    return (
      <Fragment>
        <button
          className={classNames('vtex-filter-popup__button mv0 pointer flex justify-center items-center', {
            'bb b--muted-1': openContent,
            'bn': !openContent,
          })}
          onClick={this.handleOpen}
        >
          <span className="vtex-filter-popup__title c-on-base t-action--small ml-auto">
            <FormattedMessage id="search-result.filter-action.title" />
          </span>
          <span className="vtex-filter-popup__arrow-icon ml-auto pl3 pt2">
            <FilterIcon size={16} active />
          </span>
        </button>

        <Sidebar
          onOutsideClick={this.handleClose}
          isOpen={openContent}
        >
          <AccordionFilterContainer
            map={map}
            rest={rest}
            filters={filters}
            onFilterCheck={this.handleFilterCheck}
            selectedFilters={selectedFilters}
            isOptionSelected={this.isOptionSelected}
          />
          <div className="vtex-filter-buttons__box bt b--muted-5 bottom-0 fixed w-100 items-center flex z-1 bg-base">
            <div className="bottom-0 fl w-50 pl4 pr2">
              <Button block variation="tertiary" size="default" onClick={this.handleClearFilters}>
                <FormattedMessage id="search-result.filter-button.clear" />
              </Button>
            </div>
            <div className="bottom-0 fr w-50 pr4 pl2">
              <Link
                page={pagesArgs.page}
                params={pagesArgs.params}
                query={pagesArgs.queryString}
              >
                <Button block variation="secondary" size="default">
                  <FormattedMessage id="search-result.filter-button.apply" />
                </Button>
              </Link>
            </div>
          </div>
        </Sidebar>
      </Fragment>
    )
  }
}

export default withRuntimeContext(FilterSidebar)
