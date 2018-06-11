import React, { Component } from 'react'

import { getSearchParamsFromUrl } from './constants/SearchHelpers'
import SearchResultContainer from './components/SearchResultContainer'

export default class SearchResult extends Component {
  constructor(props) {
    super(props)
    this.state = getSearchParamsFromUrl()
  }

  componentWillReceiveProps() {
    this.setState(getSearchParamsFromUrl())
  }

  render() {
    return (<SearchResultContainer {...this.state} />)
  }
}
