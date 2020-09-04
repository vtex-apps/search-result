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
  intl,
  preventRouteChange = false,
  initiallyCollapsed = false,
  navigateToFacet,
  lastOpenFilter,
  setLastOpenFilter,
  openFiltersMode,
}) => {
  const sampleFacet = facets && facets.length > 0 ? facets[0] : null
  const facetTitle = getFilterTitle(title, intl)

  return (
    <FilterOptionTemplate
      id={sampleFacet ? sampleFacet.map : null}
      title={facetTitle}
      filters={facets}
      initiallyCollapsed={initiallyCollapsed}
      lastOpenFilter={lastOpenFilter}
      setLastOpenFilter={setLastOpenFilter}
      openFiltersMode={openFiltersMode}
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
  lastOpenFilter: PropTypes.string,
  setLastOpenFilter: PropTypes.func,
  openFiltersMode: PropTypes.string,
}

export default injectIntl(SearchFilter)
