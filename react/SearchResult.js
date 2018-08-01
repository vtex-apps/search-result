import './global.css'

import React, { Component } from 'react'
import { ProductSummary } from 'vtex.product-summary'

import SearchResultInfiniteScroll from './components/SearchResultInfiniteScroll'
import { searchResultPropTypes } from './constants/propTypes'
import SortOptions from './constants/SortOptions'

const DEFAULT_MAX_ITEMS_PER_PAGE = 10

/**
 * Search Result Component.
 */
export default class SearchResult extends Component {
  constructor(props) {
    super(props)
    const { maxItemsPerPage = DEFAULT_MAX_ITEMS_PER_PAGE } = props
    props.setContextVariables({ maxItemsPerPage })
  }

  static propTypes = searchResultPropTypes

  static defaultProps = {
    orderBy: SortOptions[0].value,
    rest: '',
    maxItemsPerPage: DEFAULT_MAX_ITEMS_PER_PAGE,
  }

  static uiSchema = {
    maxItemsPerLine: {
      'ui:widget': 'radio',
      'ui:options': {
        inline: true,
      },
    },
  }

  static getSchema = props => {
    return {
      title: 'editor.search-result.title',
      description: 'editor.search-result.description',
      type: 'object',
      properties: {
        maxItemsPerPage: {
          title: 'editor.search-result.maxItemsPerPage.title',
          type: 'number',
          default: DEFAULT_MAX_ITEMS_PER_PAGE,
        },
        summary: {
          title: 'editor.search-result.summary.title',
          type: 'object',
          properties: ProductSummary.getSchema(props).properties,
        },
      },
    }
  }

  render() {
    return <SearchResultInfiniteScroll {...this.props} />
  }
}
