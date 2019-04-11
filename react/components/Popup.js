import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { IconCaret } from 'vtex.store-icons'

import searchResult from '../searchResult.css'

const { Provider, Consumer } = React.createContext()

export class PopupProvider extends Component {
  static propTypes = {
    children: PropTypes.node,
  }

  state = {
    openedItem: null,
  }

  handleClose = id => e => {
    e.preventDefault()

    if (id === this.state.openedItem) {
      this.setState({
        openedItem: null,
      })

      document.body.classList.remove(searchResult.filterPopupOpen)
    }
  }

  handleClick = id => e => {
    e.preventDefault()
    if (id === this.state.openedItem) {
      this.setState({
        openedItem: null,
      })

      document.body.classList.remove(searchResult.filterPopupOpen)
    } else {
      this.setState({
        openedItem: id,
      })

      document.body.classList.add(searchResult.filterPopupOpen)
    }
  }

  checkOpen = id =>
    id === this.state.openedItem

  render() {
    return (
      <Provider
        value={{
          onToggle: this.handleClick,
          isOpen: this.checkOpen,
          onClose: this.handleClose,
        }}
      >
        {this.props.children}
      </Provider>
    )
  }
}

export default class Popup extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func,
    ]),
    renderFooter: PropTypes.func,
    icon: PropTypes.node,
  }

  static defaultProps = {
    renderFooter: () => null,
    icon: <IconCaret orientation="down" size={16} />,
  }

  contentRef = React.createRef()

  render() {
    const { children, renderFooter, title, id, icon } = this.props

    return (
      <Consumer>
        {contextProps => {
          const { isOpen, onToggle } = contextProps
          const open = isOpen(id)

          const className = classNames(`${searchResult.filterPopup} relative justify-center flex`, {
            [searchResult.filterPopupOpen]: open,
          })

          const contentClassName = classNames(
            `${searchResult.filterPopupContentContainer} h-auto bg-base fixed dn w-100 left-0 bottom-0 z-1 ph3 overflow-y-auto flex-column`,
            {
              [`${searchResult.filterPopupContentContainerOpen} flex`]: open,
            }
          )

          const contentTop = this.contentRef.current
            ? this.contentRef.current.getBoundingClientRect().bottom + 1
            : 0

          const renderProps = {
            onClose: contextProps.onClose(id),
            onToggle: contextProps.onToggle(id),
          }

          const childrenFn = typeof children === 'function' ? children : () => children

          return (
            <div className={className} ref={this.contentRef}>
              <button
                className={classNames(`${searchResult.filterPopupButton} ph3 pv5 mv0 mh3 pointer flex justify-center items-center`, {
                  'bb b--muted-1': open,
                  'bn': !open,
                })}
                onClick={onToggle(id)}
              >
                <span className={`${searchResult.filterPopupTitle} c-on-base t-action--small ml-auto`}>{title}</span>
                <span className={`${searchResult.filterPopupArrowIcon} ml-auto pl3 pt2`}>
                  {icon}
                </span>
              </button>
              <div className={contentClassName} style={{ top: contentTop }}>
                <div className={searchResult.filterPopupContent}>
                  {childrenFn(renderProps)}
                </div>
                <div className={searchResult.filterPopupFooter}>
                  {renderFooter(renderProps)}
                </div>
              </div>
            </div>
          )
        }}
      </Consumer>
    )
  }
}
