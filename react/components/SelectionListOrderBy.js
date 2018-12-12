import React, { Component } from 'react'
import { withRuntimeContext, Link } from 'render'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import classNames from 'classnames'
import { find, propEq } from 'ramda'
import OutsideClickHandler from 'react-outside-click-handler'

import Arrow from '../images/Arrow'

class SelectionListOrderBy extends Component {
  state = {
    showDropdown: false,
  }

  handleDropdownBtClick = e => {
    e.preventDefault()
    this.setState({ ...this.state, showDropdown: !this.state.showDropdown })
  }

  handleOutsideClick = e => {
    this.setState({ ...this.state, showDropdown: false })
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
          className="c-on-base f5 ml-auto db no-underline pv4 ph5 hover-bg-muted-4"
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
    const btClass = classNames('ph3 pv5 mv0 pointer flex justify-center items-center w-100 bg-base c-on-base t-action--small ml-auto',
      {
        'bt br bl bb-0 br2 br--top bw1 b--muted-4 shadow-1': showDropdown,
        'bn pl1': !showDropdown,
      }
    )

    const contentClass = classNames('z-1 absolute bg-base shadow-5 f5 w-100 b--muted-4 br2 ba bw1 br--bottom',
      {
        'db': showDropdown,
        'dn': !showDropdown,
      }
    )

    return (
      <div className="vtex-dropdown__mobile relative justify-center flex-auto pt1 w-100 dib">
        <OutsideClickHandler onOutsideClick={this.handleOutsideClick}>
          <button onClick={this.handleDropdownBtClick} className={btClass}>
            <span className="vtex-filter-popup__title c-on-base t-action--small ml-auto">{this.getOptionTitle(orderBy)}</span>
            <span className="vtex-filter-popup__arrow-icon ml-auto pt2">
              <Arrow size={16} />
            </span>
          </button>        
          <div className={contentClass}>
            {this.renderOptions()}
          </div>
        </OutsideClickHandler>
      </div>
    )
  }
}

export default injectIntl(withRuntimeContext(SelectionListOrderBy))
