import PropTypes from 'prop-types'
import React from 'react'
import { injectIntl, intlShape } from 'react-intl'

import FilterOptionTemplate from './FilterOptionTemplate'
import FacetItem from './FacetItem'
import { facetOptionShape } from '../constants/propTypes'
import { getFilterTitle } from '../constants/SearchHelpers'

/**
 * Search Filter Component.
 */
const SearchFilter = ({
  title = 'Default Title',
  facets = [],
  quantity = 0,
  intl,
  preventRouteChange = false,
  initiallyCollapsed = false,
  navigateToFacet,
  lazyRender = false,
  truncateFilters = false,
  lastOpenFilter,
  setLastOpenFilter,
  openFiltersMode,
  truncatedFacetsFetched,
  setTruncatedFacetsFetched,
}) => {
  const sampleFacet = facets && facets.length > 0 ? facets[0] : null
  const facetTitle = getFilterTitle(title, intl)

  return (
    <FilterOptionTemplate
      id={sampleFacet ? sampleFacet.map : null}
      title={facetTitle}
      filters={facets}
      quantity={quantity}
      initiallyCollapsed={initiallyCollapsed}
      lazyRender={lazyRender}
      truncateFilters={truncateFilters}
      lastOpenFilter={lastOpenFilter}
      setLastOpenFilter={setLastOpenFilter}
      openFiltersMode={openFiltersMode}
      truncatedFacetsFetched={truncatedFacetsFetched}
      setTruncatedFacetsFetched={setTruncatedFacetsFetched}
    >
      {facet => (
        <FacetItem
          key={facet.name}
          facetTitle={facetTitle}
          facet={facet}
          preventRouteChange={preventRouteChange}
          navigateToFacet={navigateToFacet}
        />
      )}
    </FilterOptionTemplate>
  )
}

SearchFilter.propTypes = {
  /** SearchFilter's title. */
  title: PropTypes.string.isRequired,
  /** SearchFilter's options. */
  facets: PropTypes.arrayOf(facetOptionShape),
  /** Intl instance. */
  intl: intlShape.isRequired,
  /** Prevent route changes */
  preventRouteChange: PropTypes.bool,
  initiallyCollapsed: PropTypes.bool,
  navigateToFacet: PropTypes.func,
  lazyRender: PropTypes.bool,
  /** When `true`, truncates filters with more than 10 options displaying a button to see all */
  truncateFilters: PropTypes.bool,
  /** Last open filter */
  lastOpenFilter: PropTypes.string,
  /** Sets the last open filter */
  setLastOpenFilter: PropTypes.func,
  /** Dictates how many filters can be open at the same time */
  openFiltersMode: PropTypes.string,
  /** If the truncated facets were fetched */
  truncatedFacetsFetched: PropTypes.bool,
  /** Sets if the truncated facets were fetched */
  setTruncatedFacetsFetched: PropTypes.func,
  /** Quantity of facets of the current filter */
  quantity: PropTypes.number,
}

export default injectIntl(SearchFilter)
