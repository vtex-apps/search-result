import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Spinner } from 'vtex.styleguide'

export default class LoadingOverlay extends Component {
  static propTypes = {
    children: PropTypes.node,
    loading: PropTypes.bool,
  }

  static defaultProps = {
    loading: false,
  }

  root_ = React.createRef()

  handleClick = e => {
    e.stopPropagation()
  }

  componentDidMount() {
    if (this.props.loading) this.attachEvent()
  }

  attachEvent = () => {
    if (this.root_.current) {
      this.root_.current.addEventListener('click', this.handleClick, true)
    }
  }

  dettachEvent = () => {
    if (this.root_.current) {
      this.root_.current.removeEventListener('click', this.handleClick, true)
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.loading) {
      this.attachEvent()
    } else if (prevProps.loading && !this.props.loading) {
      this.dettachEvent()
    }
  }

  render() {
    const { children, loading } = this.props

    return (
      <div className="relative justify-center flex" ref={this.root_}>
        {loading && (
          <div
            className="absolute w-100 h-100 z-2"
            style={{ background: 'rgba(255, 255, 255, .6)' }}
          >
            <div className="absolute top-0 bottom-0 left-0 right-0 flex justify-center pt11">
              <Spinner />
            </div>
          </div>
        )}
        {children}
      </div>
    )
  }
}
