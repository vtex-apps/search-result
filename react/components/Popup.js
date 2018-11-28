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

  handleClose = id => e => {
    e.preventDefault()

    if (id === this.state.openedItem) {
      this.setState({
        openedItem: null,
      })

      document.body.classList.remove('vtex-filter-popup-open')
    }
  }

  handleClick = id => e => {
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
    icon: <Arrow size={8} />
  }

  contentRef = React.createRef()

  render() {
    const { children, renderFooter, title, id, icon } = this.props

    return (
      <Consumer>
        {contextProps => {
          const { isOpen, onToggle } = contextProps
          const open = isOpen(id)

          const className = classNames('vtex-filter-popup relative  justify-center flex ', {
            'vtex-filter-popup--open': open,
          })

          const contentClassName = classNames(
            'vtex-filter-popup__content-container h-auto bg-base fixed dn w-100 left-0 bottom-0 z-1 ph3 overflow-y-auto flex-column',
            {
              'vtex-filter-popup__content-container--open flex': open,
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
                className={classNames('vtex-filter-popup__button mv0 pointer flex justify-center items-center', {
                  'bb b--muted-1': open,
                  'bn': !open,
                })}
                onClick={onToggle(id)}
              >
                <span className="vtex-filter-popup__title t-action-small ml-auto">{title}</span>
                <span className="vtex-filter-popup__arrow-icon ml-auto pl3">
                  {icon}
                </span>
              </button>
              <div className={contentClassName} style={{ top: contentTop }}>
                <div className="vtex-filter-popup__content">
                  {childrenFn(renderProps)}
                </div>
                <div className="vtex-filter-popup__footer">
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
