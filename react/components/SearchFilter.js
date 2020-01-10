import PropTypes from 'prop-types'
import React from 'react'
import { injectIntl, intlShape } from 'react-intl'

import FilterOptionTemplate from './FilterOptionTemplate'
import FacetItem from './FacetItem'
import { facetOptionShape, facetQueryArgsShape } from '../constants/propTypes'
import { getFilterTitle } from '../constants/SearchHelpers'
import useSelectedFilters from '../hooks/useSelectedFilters'

/**
 * Search Filter Component.
 */
const SearchFilter = ({
  title = 'Default Title',
  facets = [],
  queryArgs = {},
  intl,
  preventRouteChange = false,
  initiallyCollapsed = false,
}) => {
  const filtersWithSelected = useSelectedFilters(facets, queryArgs)

  const sampleFacet = facets && facets.length > 0 ? facets[0] : null
  const facetTitle = getFilterTitle(title, intl)

  return (
    <FilterOptionTemplate
      id={sampleFacet ? sampleFacet.map : null}
      title={facetTitle}
      filters={filtersWithSelected}
      initiallyCollapsed={initiallyCollapsed}
    >
      {facet => (
        <FacetItem
          map={queryArgs.map}
          key={facet.name}
          facetTitle={facetTitle}
          facet={facet}
          preventRouteChange={preventRouteChange}
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
  queryArgs: PropTypes.objectOf(facetQueryArgsShape),
  /** Intl instance. */
  intl: intlShape.isRequired,
  /** Prevent route changes */
  preventRouteChange: PropTypes.bool,
  initiallyCollapsed: PropTypes.bool,
}

export default injectIntl(SearchFilter)
