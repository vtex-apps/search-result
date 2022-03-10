/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { injectIntl } from 'react-intl'
import OutsideClickHandler from 'react-outside-click-handler'
import classNames from 'classnames'
import Animation from 'vtex.store-components/Animation'

import searchResult from '../searchResult.css'

const OPEN_SIDEBAR_CLASS = 'overflow-hidden'

/* SideBar component */
class Sidebar extends Component {
  updateComponent() {
    if (this.props.isOpen) {
      document.body.classList.add(OPEN_SIDEBAR_CLASS)
    } else {
      document.body.classList.remove(OPEN_SIDEBAR_CLASS)
    }
  }

  componentDidMount() {
    this.updateComponent()
  }

  componentDidUpdate() {
    this.updateComponent()
  }

  componentWillUnmount() {
    document.body.classList.remove(OPEN_SIDEBAR_CLASS)
  }

  render() {
    const { isOpen, onOutsideClick, filtersDrawerDirectionMobile } = this.props

    if (typeof document === 'undefined') {
      return null
    }

    const scrimClasses = classNames(
      'fixed dim bg-base--inverted top-0 z-9999 w-100 vh-100 o-40 left-0',
      {
        dn: !isOpen,
      }
    )

    const sidebarClasses = classNames(
      `${searchResult.sidebar} w-auto-ns h-100 fixed top-0 z-9999 bg-base shadow-2 flex flex-column`,
      this.props.fullWidth ? 'w-100' : 'w-80',
      filtersDrawerDirectionMobile === 'drawerLeft' ? 'right-0' : 'left-0'
    )

    return ReactDOM.createPortal(
      <OutsideClickHandler onOutsideClick={onOutsideClick}>
        <div
          style={{ willChange: 'opacity' }}
          className={scrimClasses}
          onClick={onOutsideClick}
        />
        <Animation
          className={sidebarClasses}
          isActive={isOpen}
          type={filtersDrawerDirectionMobile}
        >
          {this.props.children}
        </Animation>
      </OutsideClickHandler>,
      document.body
    )
  }
}

Sidebar.propTypes = {
  /* Internationalization */
  intl: PropTypes.any,
  /* Set the sideBar visibility */
  isOpen: PropTypes.bool,
  /* Sidebar content */
  children: PropTypes.node,
  /* Function to be called when click in the close sidebar button or outside the sidebar */
  onOutsideClick: PropTypes.func,
  /* The SideBar will occupy the entire length of the window */
  fullWidth: PropTypes.bool,
  filtersDrawerDirectionMobile: PropTypes.oneOf(['drawerRight', 'drawerLeft']),
}
export default injectIntl(Sidebar)
