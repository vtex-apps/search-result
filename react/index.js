import './global.css'

import React, { Component } from 'react'
import ProductSummary from 'vtex.product-summary/index'

import { SORT_OPTIONS } from './components/OrderBy'
import SearchResultInfiniteScroll from './components/SearchResultInfiniteScroll'
import { searchResultPropTypes } from './constants/propTypes'

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
    orderBy: SORT_OPTIONS[0].value,
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
        hideBrands: {
          title: 'editor.search-result.hideBrands',
          type: 'boolean',
          isLayout: true,
        },
        hideCategories: {
          title: 'editor.search-result.hideCategories',
          type: 'boolean',
          isLayout: true,
        },
        hideRange: {
          title: 'editor.search-result.hideRange',
          type: 'boolean',
          isLayout: true,
        },
        hideSpecification: {
          title: 'editor.search-result.hideSpecification',
          type: 'boolean',
          isLayout: true,
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
