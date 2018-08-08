import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Arrow from '../images/Arrow'

const { Provider, Consumer } = React.createContext()

export class PopupProvider extends Component {
  static propTypes = {
    children: PropTypes.node,
  }

  state = {
    openedItem: null,
  }

  handleClick = (e, id) => {
    e.preventDefault()

    if (id === this.state.openedItem) {
      this.setState({
        openedItem: null,
      })

      document.body.classList.remove('vtex-filter-popup-open')
    } else {
      this.setState({
        openedItem: id,
      })

      document.body.classList.add('vtex-filter-popup-open')
    }
  }

  checkOpen = id =>
    id === this.state.openedItem

  render() {
    return (
      <Provider value={{ onClick: this.handleClick, isOpen: this.checkOpen }}>
        {this.props.children}
      </Provider>
    )
  }
}

export default class Popup extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    children: PropTypes.node,
    footer: PropTypes.node,
  }

  static defaultProps = {
    footer: null,
  }

  contentRef = React.createRef()

  render() {
    const { children, footer, title, id } = this.props

    return (
      <Consumer>
        {({ onClick, isOpen }) => {
          const open = isOpen(id)

          const className = classNames('vtex-filter-popup relative', {
            'vtex-filter-popup--open': open,
          })

          const contentClassName = classNames(
            'vtex-filter-popup__content-container h-auto bg-white fixed dn w-100 left-0 bottom-0 z-999 ph3 overflow-y-auto flex-column',
            {
              'vtex-filter-popup__content-container--open flex': open,
            }
          )

          const contentTop = this.contentRef.current
            ? this.contentRef.current.getBoundingClientRect().bottom + 1
            : 0

          return (
            <div className={className} ref={this.contentRef}>
              <button
                className="vtex-filter-popup__button pa5 mv0 mh5 pointer flex justify-center items-center"
                onClick={e => onClick(e, id)}
              >
                <span className="vtex-filter-popup__title f5 ml-auto">{title}</span>
                <span className="vtex-filter-popup__arrow-icon ml-auto">
                  <Arrow size={8} />
                </span>
              </button>
              <div className={contentClassName} style={{ top: contentTop }}>
                <div className="vtex-filter-popup__content">
                  {children}
                </div>
                <div className="vtex-filter-popup__footer nh3 bg-dark-gray">
                  {footer}
                </div>
              </div>
            </div>
          )
        }}
      </Consumer>
    )
  }
}
