import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { queryShape } from './constants/propTypes'
import { getQueryAndMap } from './constants/SearchHelpers'
import SearchResultContainer from './components/SearchResultContainer'

const DEFAULT_PAGE = 1

export default class SearchResult extends Component {
  static propTypes = {
    params: PropTypes.shape({
      /** Search's term, e.g: eletronics. */
      term: PropTypes.string.isRequired,
    }),
    query: queryShape,
  }

  render() {
    const { query: {
      order: orderBy, page: pageProps, rest, map: mapProps,
    }, params: { term } } = this.props
    const query = [term].concat(rest && rest.split(',') || []).join('/')
    const map = mapProps || getQueryAndMap(query).map
    const page = (pageProps ? parseInt(pageProps) : DEFAULT_PAGE)
    const containerProps = { path: query, map, orderBy, page }
    return (<SearchResultContainer {...containerProps} />)
  }
}
