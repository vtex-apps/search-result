import React, { Component } from 'react'
import { withRuntimeContext, Link } from 'render'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import classNames from 'classnames'
import { find, propEq } from 'ramda'

import Arrow from '../images/Arrow'

class SelectionListOrderBy extends Component {
  state = {
    showDropdown: false,
  }

  handleDropdownBtClick = e => {
    e.preventDefault()
    this.setState({ ...this.state, showDropdown: !this.state.showDropdown })
  }

  static propTypes = {
    orderBy: PropTypes.string,
    getLinkProps: PropTypes.func,
    options: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })),
    intl: intlShape,
    runtime: PropTypes.shape({
      navigate: PropTypes.func,
    }),
  }

  renderOptions = () => {
    const { options, getLinkProps } = this.props
    return options.map(option => {
      const linkProps = getLinkProps({ ordenation: option.value })
      return (
        <Link
          key={option.value}
          page={linkProps.page}
          query={linkProps.queryString}
          params={linkProps.params}
          className="c-on-base f5 ml-auto db no-underline"
        >
          {option.label}
        </Link>
      )
    })
  }

  getOptionTitle = option => {
    const { options, intl } = this.props
    return find(propEq('value', option), options).label
  }

  render() {
    const { orderBy } = this.props
    const { showDropdown } = this.state
    const btClass = classNames('ph3 pv5 mv0 pointer flex justify-center items-center bn w-100 bg-base c-on-base t-action--small ml-auto',
      {
        'vtex-dropdown__btn--active b--muted-4': showDropdown,
        'bn pl1': !showDropdown,
      }
    )

    const contentClass = classNames('vtex-dropdown__content z-1 absolute bg-base f5 w-100',
      {
        'b--muted-4 vtex-dropdown__content--active db': showDropdown,
        'dn': !showDropdown,
      }
    )

    return (
      <div className="vtex-dropdown__mobile relative justify-center flex-auto pt1 w-100 dib">
        <button onClick={this.handleDropdownBtClick} className={btClass}>
          <span className="vtex-filter-popup__title c-on-base t-action--small ml-auto">{this.getOptionTitle(orderBy)}</span>
          <span className="vtex-filter-popup__arrow-icon ml-auto pt2">
            <Arrow size={16} />
          </span>
        </button>
        <div className={contentClass}>
          {this.renderOptions()}
        </div>
      </div>
    )
  }
}

export default injectIntl(withRuntimeContext(SelectionListOrderBy))
