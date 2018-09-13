/* global __RUNTIME__ */
import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { flatten, path, identity, contains } from 'ramda'
import ContentLoader from 'react-content-loader'

import SelectedFilters from './SelectedFilters'
import AvailableFilters from './AvailableFilters'
import AccordionFilterContainer from './AccordionFilterContainer'
import {
  formatCategoriesTree,
  mountOptions,
  getMapByType,
} from '../constants/SearchHelpers'
import { facetOptionShape, paramShape } from '../constants/propTypes'

export const CATEGORIES_TYPE = 'Categories'
export const BRANDS_TYPE = 'Brands'
export const PRICE_RANGES_TYPE = 'PriceRanges'
export const SPECIFICATION_FILTERS_TYPE = 'SpecificationFilters'

const CATEGORIES_TITLE = 'search.filter.title.categories'
const BRANDS_TITLE = 'search.filter.title.brands'
const PRICE_RANGES_TITLE = 'search.filter.title.price-ranges'

/**
 * Wrapper around the filters (selected and available) as well
 * as the popup filters that appear on mobile devices
 */
export default class FiltersContainer extends Component {
  static propTypes = {
    /** Get the props to pass to render's Link */
    getLinkProps: PropTypes.func.isRequired,
    /** Categories tree */
    tree: PropTypes.arrayOf(facetOptionShape),
    /** Params from pages */
    params: paramShape.isRequired,
    /** List of brand filters (e.g. Samsung) */
    brands: PropTypes.arrayOf(facetOptionShape),
    /** List of specification filters (e.g. Android 7.0) */
    specificationFilters: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        facets: PropTypes.arrayOf(facetOptionShape),
      })
    ),
    /** List of price ranges filters (e.g. from-0-to-100) */
    priceRanges: PropTypes.arrayOf(facetOptionShape),
    /** Current price range filter query parameter */
    priceRange: PropTypes.string,
    /** Map query parameter */
    map: PropTypes.string.isRequired,
    /** Rest query parameter */
    rest: PropTypes.string.isRequired,
    /** Loading indicator */
    loading: PropTypes.bool,
    /** Indicates which facets will be hidden */
    hiddenFacets: PropTypes.shape({
      brands: PropTypes.bool,
      priceRange: PropTypes.bool,
      specificationFilters: PropTypes.bool,
      categories: PropTypes.bool,
    }),
  }

  static defaultProps = {
    tree: [],
    specificationFilters: [],
    priceRanges: [],
    brands: [],
    loading: false,
    hiddenFacets: {},
  }

  get availableCategories() {
    const params = this.props.params
    const categories = this.categories

    const categoriesCount = this.props.map
      .split(',')
      .filter(m => m === getMapByType(CATEGORIES_TYPE)).length

    const currentPath = [params.department, params.category, params.subcategory]
      .filter(v => v)
      .join('/')

    return categories
      .filter(c => c.level === categoriesCount)
      .filter(c => c.path.toLowerCase().startsWith(currentPath.toLowerCase()))
  }

  get categories() {
    const { tree } = this.props

    if (!tree || tree.length === 0) {
      return []
    }

    return formatCategoriesTree(tree)
  }

  get selectedFilters() {
    const { brands, specificationFilters, priceRanges, map, rest } = this.props

    const categories = this.categories

    const options = [
      ...mountOptions(categories, CATEGORIES_TYPE, map, rest),
      ...specificationFilters.map(spec =>
        mountOptions(spec.facets, SPECIFICATION_FILTERS_TYPE, map, rest)
      ),
      ...mountOptions(brands, BRANDS_TYPE, map, rest),
      ...mountOptions(priceRanges, PRICE_RANGES_TYPE, map, rest),
    ]

    return flatten(options).filter(opt => opt.selected)
  }

  render() {
    const {
      specificationFilters = [],
      brands,
      priceRange,
      priceRanges,
      map,
      rest,
      getLinkProps,
      loading,
      hiddenFacets,
    } = this.props

    if (loading) {
      return (
        <ContentLoader
          style={{
            width: '100%',
            height: '100%',
          }}
          width="100%"
          height="100%"
          y="0"
          x="0"
        >
          <rect width="100%" height="1em" />
          <rect width="100%" height="8em" y="1.5em" />
          <rect width="100%" height="1em" y="10.5em" />
          <rect width="100%" height="8em" y="12em" />
        </ContentLoader>
      )
    }

    const categories = this.availableCategories
    const hiddenFacetsNames = (
        path(['specificationFilters', 'hiddenFilters'], hiddenFacets) || []
      ).map(filter => filter.name)

    const mappedSpecificationFilters = !path(['specificationFilters', 'hideAll'], hiddenFacets)
      ? specificationFilters.filter(
          spec => !contains(spec.name, hiddenFacetsNames)
        ).map(spec => ({
          type: SPECIFICATION_FILTERS_TYPE,
          title: spec.name,
          options: spec.facets,
        }))
      : []

    const filters = [
      !hiddenFacets.categories && {
        type: CATEGORIES_TYPE,
        title: CATEGORIES_TITLE,
        options: categories,
        oneSelectedCollapse: true,
      },
      ...mappedSpecificationFilters,
      !hiddenFacets.brands && {
        type: BRANDS_TYPE,
        title: BRANDS_TITLE,
        options: brands,
      },
      !hiddenFacets.priceRange && {
        type: PRICE_RANGES_TYPE,
        title: PRICE_RANGES_TITLE,
        options: priceRanges,
      },
    ].filter(identity)

    if (__RUNTIME__.hints.mobile) {
      return (
        <AccordionFilterContainer
          filters={filters}
          getLinkProps={getLinkProps}
          map={map}
          rest={rest}
        />
      )
    }

    return (
      <Fragment>
        <SelectedFilters
          filters={this.selectedFilters}
          getLinkProps={getLinkProps}
        />
        <AvailableFilters
          getLinkProps={getLinkProps}
          filters={filters}
          map={map}
          rest={rest}
          priceRange={priceRange}
        />
      </Fragment>
    )
  }
}
