import PropTypes from 'prop-types'
import React from 'react'
import { injectIntl, intlShape } from 'react-intl'
import classNames from 'classnames'

import FilterOptionTemplate from './FilterOptionTemplate'
import FacetItem from './FacetItem'
import { facetOptionShape } from '../constants/propTypes'
import { getFilterTitle } from '../constants/SearchHelpers'
import useSelectedFilters from '../hooks/useSelectedFilters'

/**
 * Search Filter Component.
 */
const SearchFilter = ({
  title = 'Default Title',
  facets = [],
  intl,
  preventRouteChange = false,
}) => {
  const filtersWithSelected = useSelectedFilters(facets)

  const sampleFacet = facets && facets.length > 0 ? facets[0] : null

  return (
    <FilterOptionTemplate
      id={sampleFacet ? sampleFacet.map : null}
      title={getFilterTitle(title, intl)}
      filters={filtersWithSelected}
    >
      {facet => (
        <FacetItem
          key={facet.name}
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
  /** Intl instance. */
  intl: intlShape.isRequired,
  /** Prevent route changes */
  preventRouteChange: PropTypes.boolean,
}

export default injectIntl(SearchFilter)
