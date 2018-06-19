import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { ProductSummary } from 'vtex.product-summary'
import { queryShape, schemaPropsTypes } from './constants/propTypes'
import { getQueryAndMap } from './constants/SearchHelpers'
import SearchResultContainer from './components/SearchResultContainer'

const DEFAULT_PAGE = 1
const DEFAULT_MAX_ITEMS_PER_LINE = 5
const DEFAULT_MAX_ITEMS_PER_PAGE = 10

export default class SearchResult extends Component {
  static propTypes = {
    params: PropTypes.shape({
      /** Search's term, e.g: eletronics. */
      term: PropTypes.string.isRequired,
    }),
    query: queryShape,
    ...schemaPropsTypes,
  }

  static defaultProps = {
    maxItemsPerLine: DEFAULT_MAX_ITEMS_PER_LINE,
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
        maxItemsPerLine: {
          title: 'editor.search-result.maxItemsPerLine.title',
          type: 'number',
          enum: [3, 4, 5],
          default: DEFAULT_MAX_ITEMS_PER_LINE,
        },
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
    const {
      maxItemsPerLine,
      maxItemsPerPage,
      summary,
      query: {
        order: orderBy,
        page: pageProps,
        rest,
        map: mapProps,
      }, params: { term },
    } = this.props
    const query = [term].concat(rest && rest.split(',') || []).join('/')
    const map = mapProps || getQueryAndMap(query).map
    const page = (pageProps ? parseInt(pageProps) : DEFAULT_PAGE)
    const containerProps = {
      path: query,
      map,
      orderBy,
      page,
      maxItemsPerLine,
      maxItemsPerPage,
      summary,
    }
    return (<SearchResultContainer {...containerProps} />)
  }
}
