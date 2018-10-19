import './global.css'

import React, { Component } from 'react'
import ProductSummary from 'vtex.product-summary/index'

import SearchResultContainer from './components/SearchResultContainer'
import { SORT_OPTIONS } from './components/OrderBy'
import LocalQuery from './components/LocalQuery'

const PAGINATION_TYPES = ['show-more', 'infinite-scroll']
const DEFAULT_MAX_ITEMS_PER_PAGE = 10

/**
 * Search Result Query Loader Component.
 * This Component queries the search if the search-result doesn't receive it already
 */
export default class SearchResultQueryLoader extends Component {
  static defaultProps = {
    orderBy: SORT_OPTIONS[0].value,
    rest: '',
    querySchema: {
      maxItemsPerPage: DEFAULT_MAX_ITEMS_PER_PAGE,
    },
  }

  static uiSchema = {
    maxItemsPerLine: {
      'ui:widget': 'radio',
      'ui:options': {
        inline: true,
      },
    },
  }

  render() {
    const { querySchema } = this.props
    return !this.props.searchQuery || querySchema.enableCustomQuery ? (
      <LocalQuery
        {...this.props}
        {...querySchema}
        render={props => <SearchResultContainer {...props} />}
      />
    ) : (
      <SearchResultContainer {...this.props} />
    )
  }
}

SearchResultQueryLoader.getSchema = props => {
  const queryProperties = props.querySchema && props.querySchema.enableCustomQuery
    ? {
        maxItemsPerPage: {
          title: 'editor.search-result.query.maxItemsPerPage',
          type: 'number',
          default: DEFAULT_MAX_ITEMS_PER_PAGE,
        },
        queryField: {
          title: 'Query',
          type: 'string',
        },
        mapField: {
          title: 'Map',
          type: 'string',
        },
        restField: {
          title: 'Other Query Strings',
          type: 'string',
        },
      }
    : {}
  return {
    title: 'editor.search-result.title',
    description: 'editor.search-result.description',
    type: 'object',
    properties: {
      querySchema: {
        title: 'editor.search-result.query',
        description: 'editor.search-result.query.description',
        type: 'object',
        properties: {
          enableCustomQuery: {
            title: 'editor.search-result.query.enableCustomQuery',
            type: 'boolean',
          },
          ...queryProperties,
        },
      },
      hiddenFacets: {
        title: 'editor.search-result.hiddenFacets',
        type: 'object',
        isLayout: true,
        properties: {
          brands: {
            title: 'editor.search-result.hiddenFacets.brands',
            type: 'boolean',
            isLayout: true,
          },
          categories: {
            title: 'editor.search-result.hiddenFacets.categories',
            type: 'boolean',
            isLayout: true,
          },
          priceRange: {
            title: 'editor.search-result.hiddenFacets.priceRange',
            type: 'boolean',
            isLayout: true,
          },
          specificationFilters: {
            title: 'editor.search-result.hiddenFacets.specificationFilters',
            type: 'object',
            isLayout: true,
            properties: {
              hideAll: {
                title:
                  'editor.search-result.hiddenFacets.specificationFilters.hideAll',
                type: 'boolean',
                isLayout: true,
              },
              hiddenFilters: {
                type: 'array',
                isLayout: true,
                items: {
                  title:
                    'editor.search-result.hiddenFacets.specificationFilters.hiddenFilter',
                  type: 'object',
                  isLayout: true,
                  properties: {
                    name: {
                      title:
                        'editor.search-result.hiddenFacets.specificationFilters.hiddenFilter.name',
                      type: 'string',
                      isLayout: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
      summary: {
        title: 'editor.search-result.summary.title',
        type: 'object',
        properties: ProductSummary.getSchema(props).properties,
      },
      pagination: {
        type: 'string',
        title: 'editor.search-result.pagination.title',
        default: 'infinity-scroll',
        enum: PAGINATION_TYPES,
        enumNames: [
          'editor.search-result.pagination.show-more',
          'editor.search-result.pagination.infinite-scroll',
        ],
      },
    },
  }
}
