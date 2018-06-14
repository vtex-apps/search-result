import React, { Component } from 'react'

import { getQueryAndMap } from './constants/SearchHelpers'
import SearchResultContainer from './components/SearchResultContainer'

const DEFAULT_PAGE = 1

export default class SearchResult extends Component {

  render() {
    const {query: { O: orderBy, page: pageProps, Q, map: mapProps }, params: { term }} = this.props
    const query = [term].concat( Q && Q.split(',') || []).join('/')
    const map = mapProps || getQueryAndMap(query).map
    const page = (pageProps ? parseInt(pageProps) : DEFAULT_PAGE)
    const containerProps = { query, map, orderBy, page }
    return (<SearchResultContainer {...containerProps} />)
  }
}
