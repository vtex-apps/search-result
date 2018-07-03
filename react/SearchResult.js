import './global.css'

import React, { Component } from 'react'
import { ProductSummary } from 'vtex.product-summary'
import { Spinner } from 'vtex.styleguide'

import SearchResultInfiniteScroll from './components/SearchResultInfiniteScroll'
import { searchResultPropTypes } from './constants/propTypes'
import SortOptions from './constants/SortOptions'

const DEFAULT_PAGE = 1
const DEFAULT_MAX_ITEMS_PER_LINE = 5
const DEFAULT_MAX_ITEMS_PER_PAGE = 10

/**
 * Search Result Component.
 */
export default class SearchResult extends Component {
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

  constructor(props) {
    super(props)
    this.state = { loading: true }

    const {
      page: pageProps,
      maxItemsPerPage = DEFAULT_MAX_ITEMS_PER_PAGE,
    } = props
    const page = pageProps ? parseInt(pageProps) : DEFAULT_PAGE
    const from = (page - 1) * maxItemsPerPage
    const to = from + maxItemsPerPage - 1

    this.props.searchQuery.fetchMore({
      variables: {
        from,
        to,
      },
      updateQuery: (_, { fetchMoreResult }) => {
        this.setState({ loading: false })
        return fetchMoreResult
      },
    })
  }

  render() {
    return this.state.loading ? (
      <div className="w-100 flex justify-center">
        <div className="w3 ma0">
          <Spinner />
        </div>
      </div>
    ) : (
      <SearchResultInfiniteScroll {...this.props} />
    )
  }
}
