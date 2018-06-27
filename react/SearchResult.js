import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { ProductSummary } from 'vtex.product-summary'

import SearchResultInfiniteScroll from './components/SearchResultInfiniteScroll'
import { queryShape, schemaPropsTypes } from './constants/propTypes'
import { createMap, reversePagesPath } from './constants/SearchHelpers'

const DEFAULT_PAGE = 1
const DEFAULT_MAX_ITEMS_PER_LINE = 5
const DEFAULT_MAX_ITEMS_PER_PAGE = 10

export default class SearchResult extends Component {
  static propTypes = {
    params: PropTypes.shape({
      /** Search's term, e.g: eletronics. */
      term: PropTypes.string,
      /** Department param. */
      department: PropTypes.string,
      /** Category param. */
      category: PropTypes.string,
      /** Subcategory param. */
      subcategory: PropTypes.string,
    }),
    query: queryShape,
    /** Internal route path. e.g: 'store/search' */
    pagesPath: PropTypes.string,
    ...schemaPropsTypes,
  }

  static defaultProps = {
    maxItemsPerLine: DEFAULT_MAX_ITEMS_PER_LINE,
    maxItemsPerPage: DEFAULT_MAX_ITEMS_PER_PAGE,
    pagesPath: 'store/search',
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
      pagesPath,
      query: {
        order: orderBy,
        page: pageProps,
        map: mapProps,
        rest,
      },
    } = this.props
    const pathName = reversePagesPath(pagesPath, this.props.params)
    const map = mapProps || createMap(pathName, rest)
    const page = (pageProps ? parseInt(pageProps) : DEFAULT_PAGE)
    const containerProps = {
      path: pathName,
      map,
      rest,
      page,
      orderBy,
      maxItemsPerLine,
      maxItemsPerPage,
      summary,
      pagesPath,
    }
    return <SearchResultInfiniteScroll {...containerProps} />
  }
}
