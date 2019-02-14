import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import classNames from 'classnames'
import { find, propEq } from 'ramda'

import { withRuntimeContext, Link } from 'vtex.render-runtime'
import { IconCaret } from 'vtex.dreamstore-icons'

import searchResult from '../searchResult.css'

class SelectionListOrderBy extends Component {
  state = {
    showDropdown: false,
  }

  handleDropdownBtClick = e => {
    e.preventDefault()
    this.setState({ showDropdown: !this.state.showDropdown })
  }

  handleOutsideClick = e => {
    this.setState({ showDropdown: false })
  }

  static propTypes = {
    mobile: PropTypes.bool,
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
    const { options } = this.props
    return find(propEq('value', option), options).label
  }

  render() {
    const { orderBy, mobile, intl } = this.props
    const { showDropdown } = this.state
    const btClass = classNames('ph3 pv5 mv0 pointer flex justify-center items-center bg-base c-on-base t-action--small ml-auto bt br bl bb-0 br2 br--top bw1 w-100',
      {
        'b--muted-4 shadow-1': showDropdown && mobile,
        'b--transparent pl1': !showDropdown,
      }
    )

    const contentClass = classNames('z-1 absolute bg-base shadow-5 f5 w-100 b--muted-4 br2 ba bw1 br--bottom',
      {
        'db': showDropdown,
        'dn': !showDropdown,
      }
    )

    const dropdownSort = classNames(searchResult.dropdownSort, 'relative pt1 dib', {
      'flex-auto justify-center w-100': mobile,
    })

    return (
      <div className={dropdownSort}>
        <button onClick={this.handleDropdownBtClick} className={btClass}>
          <span className={`${searchResult.filterPopupTitle} c-on-base t-action--small ml-auto`}>{this.getOptionTitle(orderBy)} </span>
          <span className={`${searchResult.filterPopupArrowIcon} pt1 ml-auto`}>
            <IconCaret orientation="down" size={10} />
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
