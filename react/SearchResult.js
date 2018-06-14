import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { getQueryAndMap } from './constants/SearchHelpers'
import SearchResultContainer from './components/SearchResultContainer'

const DEFAULT_PAGE = 1

export default class SearchResult extends Component {
  static propTypes = {
    params: PropTypes.shape({
      /** Search's term, e.g: eletronics. */
      term: PropTypes.string.isRequired,
    }),
    query: PropTypes.shape({
      /**
       * Rest of the search term, e.g: eletronics/smartphones/samsung implies that
       * rest will be equal to "smartphones,samsung".
       * */
      rest: PropTypes.string,
      /** Determines the types of the terms, e.g: "c,c,b" (category, category, brand). */
      map: PropTypes.string,
      /** Search's pagination.  */
      page: PropTypes.string,
      /** Search's ordenation. */
      order: PropTypes.string,
    }),
  }

  render() {
    const { query: {
      order: orderBy, page: pageProps, rest, map: mapProps,
    }, params: { term } } = this.props
    const query = [term].concat(rest && rest.split(',') || []).join('/')
    const map = mapProps || getQueryAndMap(query).map
    const page = (pageProps ? parseInt(pageProps) : DEFAULT_PAGE)
    const containerProps = { query, map, orderBy, page }
    return (<SearchResultContainer {...containerProps} />)
  }
}
