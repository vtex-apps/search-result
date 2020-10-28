import React, { useMemo } from 'react'
import { useRuntime } from 'vtex.render-runtime'

import SearchResultContainer from './components/SearchResultContainer'
import { SORT_OPTIONS } from './OrderBy'
import LocalQuery from './components/LocalQuery'
import { LAYOUT_MODE } from './components/LayoutModeSwitcher'
import ContextProviders from './components/ContextProviders'
import { PAGINATION_TYPES } from './constants/paginationType'
import { SearchPageContext } from 'vtex.search-page-context/SearchPageContext'

const DEFAULT_MAX_ITEMS_PER_PAGE = 10

/**
 * Search Result Query Loader Component.
 * This Component queries the search if the search-result doesn't receive it already
 */
const trimStartingSlash = value => value && value.replace(/^\//, '')

const SearchResult = props => {
  const {
    querySchema,
    hiddenFacets,
    pagination,
    mobileLayout,
    searchQuery,
    trackingId,
  } = props
  const { query } = useRuntime()
  const settings = useMemo(
    () => ({
      hiddenFacets,
      pagination,
      mobileLayout,
      trackingId,
    }),
    [hiddenFacets, mobileLayout, pagination, trackingId]
  )

  const fieldsFromQueryString = {
    mapField: query.map,
    queryField: trimStartingSlash(query.query),
  }

  const areFieldsFromQueryStringValid = !!(
    fieldsFromQueryString.mapField && fieldsFromQueryString.queryField
  )

  return !searchQuery || (querySchema && querySchema.enableCustomQuery) ? (
    <LocalQuery
      {...props}
      {...querySchema}
      {...(areFieldsFromQueryStringValid ? fieldsFromQueryString : {})}
      render={localQueryProps => (
        <SearchPageContext.Provider
          value={{ searchQuery: localQueryProps.searchQuery }}
        >
          <ContextProviders
            queryVariables={localQueryProps.searchQuery.variables}
            settings={settings}
          >
            <SearchResultContainer {...localQueryProps} />
          </ContextProviders>
        </SearchPageContext.Provider>
      )}
    />
  ) : (
    <SearchPageContext.Provider value={{ searchQuery: searchQuery }}>
      <ContextProviders
        queryVariables={searchQuery.variables}
        settings={settings}
      >
        <SearchResultContainer {...props} />
      </ContextProviders>
    </SearchPageContext.Provider>
  )
}

SearchResult.defaultProps = {
  orderBy: SORT_OPTIONS[0].value,
}

SearchResult.getSchema = props => {
  const querySchema = !props.searchQuery
    ? {
        querySchema: {
          title: 'admin/editor.search-result.query',
          description: 'admin/editor.search-result.query.description',
          type: 'object',
          properties: {
            maxItemsPerPage: {
              title: 'admin/editor.search-result.query.maxItemsPerPage',
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
            orderByField: {
              title: 'Order by field',
              type: 'string',
              default: '',
              enum: SORT_OPTIONS.map(opt => opt.value),
              enumNames: SORT_OPTIONS.map(opt => opt.label),
            },
            hideUnavailableItems: {
              title: 'admin/editor.search-result.query.hideUnavailableItems',
              type: 'boolean',
              default: false,
            },
            skusFilter: {
              title: 'admin/editor.search-result.query.skusFilter',
              description:
                'admin/editor.search-result.query.skusFilter.description',
              type: 'string',
              default: 'ALL_AVAILABLE',
              enum: ['ALL_AVAILABLE', 'ALL', 'FIRST_AVAILABLE'],
              enumNames: [
                'admin/editor.search-result.query.skusFilter.all-available',
                'admin/editor.search-result.query.skusFilter.none',
                'admin/editor.search-result.query.skusFilter.first-available',
              ],
            },
            simulationBehavior: {
              title: 'admin/editor.search-result.query.simulationBehavior',
              description:
                'admin/editor.search-result.query.simulationBehavior.description',
              type: 'string',
              default: 'default',
              enum: ['default', 'skip'],
              enumNames: [
                'admin/editor.search-result.query.simulationBehavior.default',
                'admin/editor.search-result.query.simulationBehavior.skip',
              ],
            },
            installmentCriteria: {
              title:
                'admin/editor.search-result.query.installmentCriteria.title',
              description:
                'admin/editor.search-result.query.installmentCriteria.description',
              type: 'string',
              default: 'MAX_WITHOUT_INTEREST',
              enum: ['MAX_WITHOUT_INTEREST', 'MAX_WITH_INTEREST'],
              enumNames: [
                'admin/editor.search-result.query.installmentCriteria.max-without-interest',
                'admin/editor.search-result.query.installmentCriteria.max-with-interest',
              ],
            },
          },
        },
      }
    : {}

  return {
    title: 'admin/editor.search-result.title',
    description: 'admin/editor.search-result.description',
    type: 'object',
    dependencies: {
      advancedSettings: {
        oneOf: [
          {
            properties: {
              advancedSettings: {
                enum: [true],
              },
              trackingId: {
                title:
                  'admin.editor.search-result.advanced-settings.trackingId.title',
                description:
                  'admin.editor.search-result.advanced-settings.trackingId.description',
                type: 'string',
              },
            },
          },
        ],
      },
    },
    properties: {
      ...querySchema,
      mobileLayout: {
        title: 'admin/editor.search-result.mobileLayout',
        type: 'object',
        isLayout: true,
        properties: {
          mode1: {
            title: 'admin/editor.search-result.mobileLayout.mode1',
            type: 'string',
            default: LAYOUT_MODE[0].value,
            enum: LAYOUT_MODE.map(opt => opt.value),
            enumNames: LAYOUT_MODE.map(opt => opt.label),
            isLayout: true,
          },
          mode2: {
            title: 'admin/editor.search-result.mobileLayout.mode2',
            type: 'string',
            default: LAYOUT_MODE[1].value,
            enum: LAYOUT_MODE.map(opt => opt.value),
            enumNames: LAYOUT_MODE.map(opt => opt.label),
            isLayout: true,
          },
        },
      },
      hiddenFacets: {
        title: 'admin/editor.search-result.hiddenFacets',
        type: 'object',
        isLayout: true,
        properties: {
          brands: {
            title: 'admin/editor.search-result.hiddenFacets.brands',
            type: 'boolean',
            isLayout: true,
          },
          categories: {
            title: 'admin/editor.search-result.hiddenFacets.categories',
            type: 'boolean',
            isLayout: true,
          },
          priceRange: {
            title: 'admin/editor.search-result.hiddenFacets.priceRange',
            type: 'boolean',
            isLayout: true,
          },
          specificationFilters: {
            title:
              'admin/editor.search-result.hiddenFacets.specificationFilters',
            type: 'object',
            isLayout: true,
            properties: {
              hideAll: {
                title:
                  'admin/editor.search-result.hiddenFacets.specificationFilters.hideAll',
                type: 'boolean',
                isLayout: true,
              },
              hiddenFilters: {
                type: 'array',
                isLayout: true,
                items: {
                  title:
                    'admin/editor.search-result.hiddenFacets.specificationFilters.hiddenFilter',
                  type: 'object',
                  isLayout: true,
                  properties: {
                    name: {
                      title:
                        'admin/editor.search-result.hiddenFacets.specificationFilters.hiddenFilter.name',
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
      pagination: {
        type: 'string',
        title: 'admin/editor.search-result.pagination.title',
        default: 'infinite-scroll',
        enum: PAGINATION_TYPES,
        enumNames: [
          'admin/editor.search-result.pagination.show-more',
          'admin/editor.search-result.pagination.infinite-scroll',
        ],
        isLayout: true,
      },
      advancedSettings: {
        title: 'admin.editor.search-result.advanced-settings.title',
        type: 'boolean',
      },
    },
  }
}

export default SearchResult
