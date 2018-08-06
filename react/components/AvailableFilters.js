import React, { Component } from 'react'
import PropTypes from 'prop-types'

import SearchFilter from './SearchFilter'
import { mountOptions } from '../constants/SearchHelpers'

export default class AvailableFilters extends Component {
  static propTypes = {
    filters: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string,
      type: PropTypes.string,
      rest: PropTypes.string,
      oneSelectedCollapse: PropTypes.bool,
    })),
    map: PropTypes.string,
    rest: PropTypes.string,
    getLinkProps: PropTypes.func,
  }

  static defaultProps = {
    filters: [],
  }

  render() {
    const { filters, map, rest, getLinkProps } = this.props

    return filters.map(filter => {
      const { type, title, options, oneSelectedCollapse = false } = filter

      return (
        <SearchFilter
          key={title}
          title={title}
          options={mountOptions(options, type, map, rest)}
          oneSelectedCollapse={oneSelectedCollapse}
          type={type}
          getLinkProps={getLinkProps}
        />
      )
    })
  }
}

