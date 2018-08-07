import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Arrow from '../images/Arrow'

export default class MaybeRenderPopup extends Component {
  static propTypes = {
    isMobile: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.node,
    footer: PropTypes.node,
  }

  static defaultProps = {
    footer: null,
  }

  contentRef = React.createRef()

  state = {
    open: false,
  }

  handleClick = e => {
    e.preventDefault()

    if (!this.state.open) {
      document.body.classList.add('vtex-filter-popup-open')
    } else {
      document.body.classList.remove('vtex-filter-popup-open')
    }

    this.setState({
      open: !this.state.open,
    })
  }

  render() {
    const { isMobile, children, footer, title } = this.props

    const contentClassName = classNames('vtex-filter-popup__content-container bg-white', {
      'vtex-filter-popup__content-container--open': this.state.open,
    })

    const contentTop = this.contentRef.current
      ? this.contentRef.current.getBoundingClientRect().bottom
      : 0

    return (
      <div className="vtex-filter-popup relative" ref={this.contentRef}>
        {isMobile && (
          <button
            className="vtex-filter-popup__button w-100 pointer flex justify-center items-center"
            onClick={this.handleClick}
          >
            <span className="vtex-filter-popup__title">{title}</span>
            <span className="vtex-filter-popup__arrow-icon">
              <Arrow />
            </span>
          </button>
        )}
        <div className={contentClassName} style={{ top: contentTop }}>
          <div className="vtex-filter-popup__content">
            {children}
          </div>
          {isMobile && (
            <div className="vtex-filter-popup__footer">
              {footer}
            </div>
          )}
        </div>
      </div>
    )
  }
}
