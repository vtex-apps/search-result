import classNames from 'classnames'
import PropTypes from 'prop-types'
import { map, flatten, path, contains, filter, prop } from 'ramda'
import React, { useMemo } from 'react'
import ContentLoader from 'react-content-loader'
import { FormattedMessage } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'

import FilterSidebar from './components/FilterSidebar'
import SelectedFilters from './components/SelectedFilters'
import AvailableFilters from './components/AvailableFilters'
import {
  facetOptionShape,
  paramShape,
  hiddenFacetsSchema,
} from './constants/propTypes'
import useSelectedFilters from './hooks/useSelectedFilters'

import searchResult from './searchResult.css'

export const CATEGORIES_TYPE = 'Categories'
export const BRANDS_TYPE = 'Brands'
export const PRICE_RANGES_TYPE = 'PriceRanges'
export const SPECIFICATION_FILTERS_TYPE = 'SpecificationFilters'

const CATEGORIES_TITLE = 'store/search.filter.title.categories'
const BRANDS_TITLE = 'store/search.filter.title.brands'
const PRICE_RANGES_TITLE = 'store/search.filter.title.price-ranges'

const getCategories = (tree = []) => {
  return [
    ...tree,
    ...flatten(tree.map(node => node.children && getCategories(node.children))),
  ].filter(Boolean)
}

/**
 * Wrapper around the filters (selected and available) as well
 * as the popup filters that appear on mobile devices
 */
const FilterNavigator = ({
  showFilters,
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

  const selectedFilters = useSelectedFilters(
    useMemo(() => {
      const availableCategories = filter(prop('selected'), getCategories(tree))

      const options = [
        ...availableCategories,
        ...map(prop('facets'), specificationFilters),
        ...brands,
        ...priceRanges,
      ]

      return flatten(options)
    }, [brands, priceRanges, specificationFilters, tree])
  ).filter(facet => facet.selected)

  const getFilters = () => {
    const categories = getCategories(tree)

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
    'flex justify-center flex-auto': mobile,
  })

  if (!showFilters) {
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
          <FilterSidebar filters={getFilters()} />
        </div>
      </div>
    )
  }

  return (
    <div className={searchResult.filters}>
      <div className={filterClasses}>
        <div className="bb b--muted-4">
          <h5 className="t-heading-5 mv5">
            <FormattedMessage id="store/search-result.filter-button.title" />
          </h5>
        </div>
        <SelectedFilters filters={selectedFilters} />
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
  /** Enables or disables filters */
  showFilters: PropTypes.bool,
  /** Loading indicator */
  loading: PropTypes.bool,
  ...hiddenFacetsSchema,
}

export default FilterNavigator
