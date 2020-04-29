import classNames from 'classnames'
import PropTypes from 'prop-types'
import { flatten } from 'ramda'
import React, { useMemo, Fragment } from 'react'
import ContentLoader from 'react-content-loader'
import { FormattedMessage } from 'react-intl'
import { ExtensionPoint } from 'vtex.render-runtime'
import { useDevice } from 'vtex.device-detector'
import { useCssHandles, applyModifiers } from 'vtex.css-handles'

import FilterSidebar from './components/FilterSidebar'
import SelectedFilters from './components/SelectedFilters'
import AvailableFilters from './components/AvailableFilters'
import DepartmentFilters from './components/DepartmentFilters'
import {
  facetOptionShape,
  paramShape,
  hiddenFacetsSchema,
} from './constants/propTypes'
import useFacetNavigation from './hooks/useFacetNavigation'

import styles from './searchResult.css'
import { CATEGORIES_TITLE } from './utils/getFilters'
import { newFacetPathName } from './utils/slug'

const CSS_HANDLES = ['filter__container', 'filterMessage', 'filtersWrapper']

const LAYOUT_TYPES = {
  responsive: 'responsive',
  desktop: 'desktop',
}

const getSelectedCategories = tree => {
  for (const node of tree) {
    if (!node.selected) {
      continue
    }
    if (node.children) {
      return [node, ...getSelectedCategories(node.children)]
    } else {
      return [node]
    }
  }
  return []
}

const newNamedFacet = facet => {
  return { ...facet, newQuerySegment: newFacetPathName(facet) }
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
  filters = [],
  preventRouteChange = false,
  hiddenFacets = {},
  initiallyCollapsed = false,
  layout = LAYOUT_TYPES.responsive,
  maxItemsDepartment = 8,
  maxItemsCategory = 8,
}) => {
  const { isMobile } = useDevice()
  const handles = useCssHandles(CSS_HANDLES)
  const mobileLayout =
    (isMobile && layout === LAYOUT_TYPES.responsive) ||
    layout === LAYOUT_TYPES.mobile

  const selectedFilters = useMemo(() => {
    const options = [
      ...specificationFilters.map(filter => {
        return filter.facets.map(facet => {
          return newNamedFacet({ ...facet, title: filter.name })
        })
      }),
      ...brands,
      ...priceRanges,
    ]
    return flatten(options)
  }, [brands, priceRanges, specificationFilters]).filter(
    facet => facet.selected
  )

  const selectedCategories = getSelectedCategories(tree)
  const navigateToFacet = useFacetNavigation(
    useMemo(() => {
      return selectedCategories.concat(selectedFilters)
    }, [selectedFilters, selectedCategories])
  )

  const filterClasses = classNames({
    'flex items-center justify-center flex-auto h-100': mobileLayout,
    dn: loading,
  })

  return (
    <Fragment>
      {loading && !mobileLayout ? (
        <div className="mv5">
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
        </div>
      ) : null}

      {mobileLayout ? (
        <div className={styles.filters}>
          <div className={filterClasses}>
            <FilterSidebar
              selectedFilters={selectedCategories.concat(selectedFilters)}
              filters={filters}
              tree={tree}
              priceRange={priceRange}
              preventRouteChange={preventRouteChange}
              navigateToFacet={navigateToFacet}
            />
          </div>
        </div>
      ) : (
        <Fragment>
          <div className={handles.filtersWrapper}>
            <div
              className={`${applyModifiers(
                handles.filter__container,
                'title'
              )} bb b--muted-4`}
            >
              <h5 className={`${handles.filterMessage} t-heading-5 mv5`}>
                <FormattedMessage id="store/search-result.filter-button.title" />
              </h5>
            </div>
            <SelectedFilters
              filters={selectedFilters}
              preventRouteChange={preventRouteChange}
              navigateToFacet={navigateToFacet}
            />
            <DepartmentFilters
              title={CATEGORIES_TITLE}
              tree={tree}
              isVisible={!hiddenFacets.categories}
              onCategorySelect={navigateToFacet}
              preventRouteChange={preventRouteChange}
              maxItemsDepartment={maxItemsDepartment}
              maxItemsCategory={maxItemsCategory}
            />
            <AvailableFilters
              filters={filters}
              priceRange={priceRange}
              preventRouteChange={preventRouteChange}
              initiallyCollapsed={initiallyCollapsed}
              navigateToFacet={navigateToFacet}
            />
          </div>
          <ExtensionPoint id="shop-review-summary" />
        </Fragment>
      )}
    </Fragment>
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
  layout: PropTypes.oneOf(Object.values(LAYOUT_TYPES)),
  initiallyCollapsed: PropTypes.bool,
  ...hiddenFacetsSchema,
}

export default FilterNavigator
