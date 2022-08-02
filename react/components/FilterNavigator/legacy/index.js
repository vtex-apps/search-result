/**
 * WARNING THIS COMPONENT IS DEPRECATED, PLEASE USE THE BLOCK "filter-navigator.v2". THIS COMPONENT WILL BE DELETED IN THE NEXT MAJOR.
 */

import classNames from 'classnames'
import PropTypes from 'prop-types'
import { map, flatten, filter, prop } from 'ramda'
import React, { useMemo } from 'react'
import ContentLoader from 'react-content-loader'
import { FormattedMessage } from 'react-intl'
import { useDevice } from 'vtex.device-detector'

import FilterSidebar from './FilterSidebar'
import SelectedFilters from './SelectedFilters'
import AvailableFilters from './AvailableFilters'
import {
  facetOptionShape,
  paramShape,
  hiddenFacetsSchema,
} from '../../../constants/propTypes'
import useSelectedFilters from './hooks/useSelectedFilters'
import getFilters from './utils/getFilters'

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
  priceRange,
  tree = [],
  specificationFilters = [],
  priceRanges = [],
  brands = [],
  loading = false,
  hiddenFacets = {},
  preventRouteChange = false,
  initiallyCollapsed = false,
}) => {
  const { isMobile } = useDevice()

  const filters = getFilters({
    tree,
    specificationFilters,
    priceRanges,
    brands,
    hiddenFacets,
  })

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

  const filterClasses = classNames({
    'flex justify-center flex-auto bl br b--muted-5': isMobile,
  })

  if (loading && !isMobile) {
    return (
      <ContentLoader
        style={{
          width: '230px',
          height: '320px',
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
    )
  }

  if (isMobile) {
    return (
      <div className={filterClasses}>
        <FilterSidebar
          filters={filters}
          preventRouteChange={preventRouteChange}
        />
      </div>
    )
  }

  return (
    <div className={filterClasses}>
      <div className="bb b--muted-4">
        <h5 className="t-heading-5 mv5">
          <FormattedMessage id="store/search-result.filter-button.title" />
        </h5>
      </div>
      <SelectedFilters
        filters={selectedFilters}
        preventRouteChange={preventRouteChange}
      />
      <AvailableFilters
        filters={filters}
        priceRange={priceRange}
        preventRouteChange={preventRouteChange}
        initiallyCollapsed={initiallyCollapsed}
      />
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
  /** Loading indicator */
  loading: PropTypes.bool,
  /** Prevents changing route when setting filters (uses URL search params instead) */
  preventRouteChange: PropTypes.bool,
  ...hiddenFacetsSchema,
}

export default FilterNavigator
