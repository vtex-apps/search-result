import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { graphql, compose, ApolloConsumer } from 'react-apollo'
import { equals } from 'ramda'
import QueryString from 'query-string'

import Spinner from '@vtex/styleguide/lib/Spinner'
import Gallery from './components/Gallery'
import SearchHeader from './components/SearchHeader'
import SearchFilter from './components/SearchFilter'

import searchQuery from './graphql/searchQuery.gql'
import facetsQuery from './graphql/facetsQuery.gql'

import { getFacetsFromURL, getSearchParamsFromURL } from './constants/graphqlHelpers'
import SortOptions from './constants/SortOptions'
import VTEXClasses from './constants/CSSClasses'
import './global.css'

/**
 * Search Result Component.
 */
class SearchResult extends Component {
  constructor(props) {
    super(props)
    const query = props.query || props.searchQuery && props.searchQuery.variables.query
    const map = props.map || props.searchQuery.variables.map

    this.state = {
      loading: false,
      sortSelected: props.defaultOrderBy,
      query,
      map,
      facets: (props.facetsQuery && props.facetsQuery.facets) || {},
      products: (props.searchQuery && props.searchQuery.products) || [],
      selecteds: this.getSelecteds(query, map),
    }
  }

  countSelecteds() {
    let count = 0
    for (const key in this.state.selecteds) {
      console.log(this.state.selecteds[key])
      if (this.state.selecteds[key]) {
        count += this.state.selecteds[key].length
      }
    }
    console.log(count)
    return count
  }

  getSelecteds(query, map) {
    const selecteds = {
      SpecificationFilters: [],
      Departments: [],
      Brands: [],
      FullText: [],
    }

    if (!query && !map) return selecteds

    const pathValues = query.split('/')
    const queryValues = map.split(',')

    pathValues.map((val, i) => {
      if (i > queryValues.length - 1) {
        selecteds.Departments.push(val)
      } else {
        if (queryValues[i] === 'c') {
          selecteds.Departments.push(val.toUpperCase())
        } else if (queryValues[i] === 'b') {
          selecteds.Brands.push(val.toUpperCase())
        } else if (queryValues[i].indexOf('specificationFilter') !== -1) {
          selecteds.SpecificationFilters.push(val.toUpperCase())
        } else if (queryValues[i] === 'ft') {
          selecteds.FullText = [val]
        }
      }
    })

    return selecteds
  }

  handleSortChange = (sortSelected) => {
    this.props.searchQuery.refetch({
      query: this.state.query,
      map: this.state.map,
      orderBy: sortSelected,
    }).then(() => {
      this.setState({ sortSelected })
    })
  }

  handleFilterSelected = (link) => {
    const query = QueryString.parseUrl(link).url
    const map = QueryString.parseUrl(link).query.map
    const searchPromise = this.c.query({
      query: searchQuery,
      variables: {
        query,
        map,
        orderBy: this.state.sortSelected,
      },
    })
    const facetsPromise = this.c.query({
      query: facetsQuery,
      variables: {
        facets: link,
      },
    })
    this.setState({ loading: true })
    searchPromise.then((res) => {
      const products = res.data.products
      facetsPromise.then((res) => {
        this.setState({
          query,
          map,
          facets: res.data.facets,
          products,
          selecteds: this.getSelecteds(query, map),
          loading: false,
        })
      }, this.callbackFilterError)
    }, this.callbackFilterError)
  }

  callbackFilterError = () => {
    this.setState({
      loading: false,
    })
  }

  componentWillReceiveProps(props) {
    const { searchQuery, facetsQuery } = props
    const { products, facets, selectedSort } = this.state
    if (facetsQuery && facetsQuery.facets && !facetsQuery.loading && !equals(facetsQuery.facets, facets)) {
      this.setState({
        facets: facetsQuery.facets,
      })
    }
    if (searchQuery && searchQuery.products && !searchQuery.loading && (!equals(searchQuery.products, products) || !equals(searchQuery.variables.orderBy, selectedSort))) {
      this.setState({
        products: searchQuery.products,
      })
    }
  }

  renderSearchFilters() {
    const { facets, selecteds, query, map } = this.state
    const keys = Object.keys(facets)
    keys.splice(keys.indexOf('__typename'), 1)
    return keys.map(key => {
      if (key === 'SpecificationFilters') {
        return facets[key].map(filter => {
          return (
            <SearchFilter key={filter.name} title={filter.name} options={filter.facets}
              type={key} onSelected={this.handleFilterSelected} selecteds={selecteds[key]}
              query={query} map={map} disabled={this.countSelecteds() === 1} />)
        })
      }
      return (
        <SearchFilter key={key} title={key} options={facets[key]} type={key}
          query={query} map={map} disabled={this.countSelecteds() === 1}
          onSelected={this.handleFilterSelected} selecteds={selecteds[key]} />)
    })
  }

  renderSelectedFilters() {
    const selectedsFilters = []
    const keys = Object.keys(this.state.selecteds)
    keys.map(key => {
      this.state.selecteds[key].map(val => {
        selectedsFilters.push(
          `${key}: ${val}`
        )
      })
    })
    return (
      <div className="flex flex-column pa4 bb b--light-gray pb7">
        <div className="f4 pv4">
          Selected Filters
        </div>
        <div>
          {selectedsFilters.map(selected => (
            <div className="bg-silver pa4 br3 mb2 mr2 fl" key={selected}>
              {selected}
              {this.countSelecteds() > 1 && <span className="fr red pl4 pointer">x</span>}
            </div>
          ))}
        </div>
      </div>
    )
  }

  render() {
    const { searchQuery, facetsQuery } = this.props
    const { products, facets, loading, query, map } = this.state
    let recordsFiltered = products.length
    if (facets && facets.Departments) {
      let count = 0
      facets.Departments.map(dep => {
        count += dep.Quantity
      })
      recordsFiltered = count
    }

    const isLoading = searchQuery && searchQuery.loading || facetsQuery && facetsQuery.loading || loading
    const headerText = `${query}?map=${map}`

    return (
      <ApolloConsumer>
        {client =>
          (<div className={`${VTEXClasses.MAIN_CLASS} w-100 pa3 flex`}>
            {(() => { this.c = client })()}
            <div className="w-20 fl">
              {this.renderSelectedFilters()}
              {this.renderSearchFilters()}
            </div>
            <div className="w-80 fl">
              <SearchHeader
                from={products.length ? 1 : 0}
                to={products.length}
                recordsFiltered={recordsFiltered || 0}
                onSortChange={this.handleSortChange}
                selectedSort={this.state.sortSelected}
                sortingOptions={SortOptions}
                headerText={headerText}
              />
              {
                isLoading ? (
                  <div className="w-100 flex justify-center">
                    <div className="w3 ma0">
                      <Spinner />
                    </div>
                  </div>
                ) : (
                  <Gallery products={products} />
                )
              }
            </div>
          </div>)
        }
      </ApolloConsumer>
    )
  }
}

const SearchResultWithData = compose(
  graphql(facetsQuery, { name: 'facetsQuery',
    options: (props) => {
      const propsFacets = props.query && props.map && `${props.query}?map=${props.map}`
      const facets = propsFacets || window.location && getFacetsFromURL(window.location.pathname, QueryString.parse(window.location.search))
      return ({
        variables: { facets },
        ssr: !!facets,
      })
    },
  }),
  graphql(searchQuery, { name: 'searchQuery',
    options: (props) => {
      const searchParams = (window.location && getSearchParamsFromURL(window.location.pathname, QueryString.parse(window.location.search))) || {}
      const query = props.search || searchParams.query
      const map = props.map || searchParams.map
      const orderBy = props.defaultOrderBy
      return {
        variables: { query, map, orderBy },
        ssr: !!query,
      }
    },
  }),
)(SearchResult)

SearchResult.uiSchema = SearchResultWithData.uiSchema = {
  columnsQuantityLarge: {
    'ui:widget': 'radio',
    'ui:options': {
      inline: true,
    },
  },
  columnsQuantityMedium: {
    'ui:widget': 'radio',
    'ui:options': {
      inline: true,
    },
  },
}

SearchResult.schema = SearchResultWithData.schema = {
  title: 'Search Result',
  description: 'Search Result Wrapper',
  type: 'object',
  properties: {
    columnsQuantityLarge: {
      title: 'Columns quantity (Large Viewport)',
      type: 'number',
      enum: [3, 4, 5],
      default: 5,
    },
    columnsQuantityMedium: {
      title: 'Columns quantity (Medium Viewport)',
      type: 'number',
      enum: [2, 3],
      default: 3,
    },
  },
}

SearchResult.propTypes = SearchResultWithData.propTypes = {
  /** Quantity of columns when the viewport is large.*/
  columnsQuantityLarge: PropTypes.number,
  /** Quantity of columns when the viewport is medium.*/
  columnsQuantityMedium: PropTypes.number,
  /** Products to be displayed */
  products: PropTypes.array,
  /** Query used to find the products */
  query: PropTypes.string,
  map: PropTypes.string,
  defaultOrderBy: PropTypes.string,
  facetsQuery: PropTypes.shape({
    Departments: PropTypes.arrayOf(PropTypes.shape({
      Quantity: PropTypes.number.isRequired,
      Link: PropTypes.string.isRequired,
      Name: PropTypes.string.isRequired,
    })),
    Brands: PropTypes.arrayOf(PropTypes.shape({
      Quantity: PropTypes.number.isRequired,
      Link: PropTypes.string.isRequired,
      Name: PropTypes.string.isRequired,
    })),
    SpecificationFilters: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      facets: PropTypes.shape({
        Quantity: PropTypes.number.isRequired,
        Link: PropTypes.string.isRequired,
        Name: PropTypes.string.isRequired,
      }),
    })),
  }),
  searchQuery: PropTypes.shape({
    products: PropTypes.arrayOf(
      PropTypes.shape({
        productId: PropTypes.string.isRequired,
        productName: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        categories: PropTypes.array,
        link: PropTypes.string,
        linkText: PropTypes.string.isRequired,
        brand: PropTypes.string,
        items: PropTypes.arrayOf(
          PropTypes.shape({
            itemId: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            referenceId: PropTypes.arrayOf(
              PropTypes.shape({
                Value: PropTypes.string.isRequired,
              })
            ),
            images: PropTypes.arrayOf(
              PropTypes.shape({
                imageUrl: PropTypes.string.isRequired,
                imageTag: PropTypes.string.isRequired,
              })
            ).isRequired,
            sellers: PropTypes.arrayOf(
              PropTypes.shape({
                commertialOffer: PropTypes.shape({
                  Price: PropTypes.number.isRequired,
                  ListPrice: PropTypes.number.isRequired,
                }).isRequired,
              })
            ).isRequired,
          })
        ).isRequired,
      })
    ),
  }),
}

SearchResult.defaultProps = SearchResultWithData.defaultProps = {
  columnsQuantityLarge: 5,
  columnsQuantityMedium: 3,
  products: [],
  defaultOrderBy: SortOptions[0].value,
  query: '',
  map: '',
}

export default SearchResultWithData
