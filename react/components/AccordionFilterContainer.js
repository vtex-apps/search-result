import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'render'
import { injectIntl, intlShape } from 'react-intl'
import { flatten, map, filter, pipe } from 'ramda'

import Popup from './Popup'
import FooterButton from './FooterButton'
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
    selectedOptions: pipe(
      map(filter =>
        mountOptions(filter.options, filter.type, this.props.map, this.props.rest),
      ),
      flatten,
      filter(option => option.selected),
      map(option => ({
        ...option,
        name: option.Name,
        link: option.Link,
      }))
    )(this.props.filters || []),
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

  isTypeActive = opt => (
    !!this.state.selectedOptions.find(e => e.type === opt.type)
  )

  isOptionActive = opt => (
    !!this.state.selectedOptions.find(e => e.Name === opt.Name)
  )

  handleSelectOption = (e, option) => {
    e.preventDefault()

    if ((option.oneSelectedCollapse && !this.isTypeActive(option)) ||
       (!option.oneSelectedCollapse && !this.isOptionActive(option))) {
      this.setState({
        selectedOptions: [
          ...this.state.selectedOptions,
          {
            ...option,
            link: option.Link,
            name: option.Name,
          },
        ],
      })
    } else if (
      option.oneSelectedCollapse &&
      this.isTypeActive(option) &&
      !this.isOptionActive(option)
    ) {
      this.setState({
        selectedOptions: this.state.selectedOptions.map(
          e => e.type === option.type ? option : e
        ),
      })
    } else {
      this.setState({
        selectedOptions:
          this.state.selectedOptions.filter(opt => opt.Name !== option.Name),
      })
    }
  }

  render() {
    const { filters, intl, getLinkProps, map, rest } = this.props
    const { openedItem, selectedOptions } = this.state

    const linkProps = getLinkProps(selectedOptions, true)

    return (
      <Popup
        title={intl.formatMessage({ id: 'search-result.filter-button.title' })}
        id="filters"
        renderFooter={({ onClose }) => (
          <div className="flex justify-between pv3 ph6">
            <FooterButton onClick={this.handleClean}>
              {intl.formatMessage({ id: 'search-result.clear-filters.title' })}
            </FooterButton>
            <div className="bg-white self-stretch" style={{ width: 1 }} />
            <FooterButton
              tag={Link}
              page={linkProps.page}
              params={linkProps.params}
              query={linkProps.queryString}
              onClick={e => {
                onClose(e)

                this.setState({
                  openedItem: null,
                })
              }}
            >
              {intl.formatMessage({ id: 'search-result.filter-action.title' })}
            </FooterButton>
          </div>
        )}
      >
        <div className="vtex-accordion-filter">
          {filters.map(filter => {
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
                onSelectOption={this.handleSelectOption}
                isOptionActive={this.isOptionActive}
                oneSelectedCollapse={oneSelectedCollapse}
              />
            )
          })}
        </div>
      </Popup>
    )
  }
}

export default injectIntl(AccordionFilterContainer)
