import React from 'react'
import PropTypes from 'prop-types'
import { useRuntime } from 'vtex.render-runtime'
import { flatten, path, contains } from 'ramda'
import ContentLoader from 'react-content-loader'
import classNames from 'classnames'
import { FormattedMessage } from 'react-intl'

import FilterSidebar from './components/FilterSidebar'
import SelectedFilters from './components/SelectedFilters'
import AvailableFilters from './components/AvailableFilters'
import { getMapByType } from './constants/SearchHelpers'
import {
  facetOptionShape,
  paramShape,
  hiddenFacetsSchema,
} from './constants/propTypes'

import searchResult from './searchResult.css'

export const CATEGORIES_TYPE = 'Categories'
export const BRANDS_TYPE = 'Brands'
export const PRICE_RANGES_TYPE = 'PriceRanges'
export const SPECIFICATION_FILTERS_TYPE = 'SpecificationFilters'

const CATEGORIES_TITLE = 'search.filter.title.categories'
const BRANDS_TITLE = 'search.filter.title.brands'
const PRICE_RANGES_TITLE = 'search.filter.title.price-ranges'

const getCategories = tree => {
  if (!tree || !tree.length) {
    return []
  }
  return [...tree, tree.Children && getCategories(tree.Children)].filter(
    Boolean
  )
}

const getAvailableCategories = ({
  tree,
  query,
  map,
  showOnlySelected = false,
}) => {
  let queryParams = query || ''

  const mapArray = map.split(',')

  const categoriesCount = mapArray.filter(
    m => m === getMapByType(CATEGORIES_TYPE)
  ).length

  const currentPath = queryParams
    .split('/')
    .filter((_, index) => mapArray[index] === getMapByType(CATEGORIES_TYPE))
    .join('/')

  return getCategories(tree)
    .filter(c =>
      showOnlySelected
        ? c.level === categoriesCount - 1
        : c.level === categoriesCount - 1 || c.level === categoriesCount
    )
    .filter(c => c.path.toLowerCase().startsWith(currentPath.toLowerCase()))
}

/**
 * Wrapper around the filters (selected and available) as well
 * as the popup filters that appear on mobile devices
 */
const FilterNavigator = ({
  query,
  map,
  priceRange,
  tree = [],
  specificationFilters = [],
  priceRanges = [],
  brands = [],
  loading = false,
  hiddenFacets = {},
}) => {
  const {
    hints: { mobile },
  } = useRuntime()

  const getSelectedFilters = () => {
    const availableCategories = getAvailableCategories({
      tree,
      query,
      map,
      showOnlySelected: true,
    })

    const options = [
      ...availableCategories,
      ...specificationFilters.map(spec => spec.facets),
      ...brands,
      ...priceRanges,
    ]

    return flatten(options).filter(opt => opt.selected)
  }

  const getFilters = () => {
    const categories = getAvailableCategories({ tree, query, map })

    const hiddenFacetsNames = (
      path(['specificationFilters', 'hiddenFilters'], hiddenFacets) || []
    ).map(filter => filter.name)

    const mappedSpecificationFilters = !path(
      ['specificationFilters', 'hideAll'],
      hiddenFacets
    )
      ? specificationFilters
          .filter(spec => !contains(spec.name, hiddenFacetsNames))
          .map(spec => ({
            type: SPECIFICATION_FILTERS_TYPE,
            title: spec.name,
            facets: spec.facets,
          }))
      : []

    return [
      !hiddenFacets.categories && {
        type: CATEGORIES_TYPE,
        title: CATEGORIES_TITLE,
        facets: categories,
      },
      ...mappedSpecificationFilters,
      !hiddenFacets.brands && {
        type: BRANDS_TYPE,
        title: BRANDS_TITLE,
        facets: brands,
      },
      !hiddenFacets.priceRange && {
        type: PRICE_RANGES_TYPE,
        title: PRICE_RANGES_TITLE,
        facets: priceRanges,
      },
    ].filter(Boolean)
  }

  const filterClasses = classNames({
    'flex justify-center flex-auto ': mobile,
  })

  if (!map || !map.length) {
    return null
  }

  if (loading && !mobile) {
    return (
      <div className={searchResult.filters}>
        <ContentLoader
          style={{
            width: '100%',
            height: '100%',
          }}
          width="230"
          height="320"
          y="0"
          x="0"
        >
          <rect width="100%" height="1em" />
          <rect width="100%" height="8em" y="1.5em" />
          <rect width="100%" height="1em" y="10.5em" />
          <rect width="100%" height="8em" y="12em" />
        </ContentLoader>
      </div>
    )
  }

  if (mobile) {
    return (
      <div className={searchResult.filters}>
        <div className={filterClasses}>
          <FilterSidebar
            filters={getFilters()}
            selectedFilters={getSelectedFilters()}
            map={map}
          />
        </div>
      </div>
    )
  }

  return (
    <div className={searchResult.filters}>
      <div className={filterClasses}>
        <div className="bb b--muted-4">
          <h5 className="t-heading-5 mv5">
            <FormattedMessage id="search-result.filter-button.title" />
          </h5>
        </div>
        <SelectedFilters filters={getSelectedFilters()} />
        <AvailableFilters filters={getFilters()} priceRange={priceRange} />
      </div>
    </div>
  )
}

FilterNavigator.propTypes = {
  /** Categories tree */
  tree: PropTypes.arrayOf(facetOptionShape),
  /** Params from pages */
  params: paramShape,
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
  map: PropTypes.string,
  /** Loading indicator */
  loading: PropTypes.bool,
  ...hiddenFacetsSchema,
}

export default FilterNavigator
