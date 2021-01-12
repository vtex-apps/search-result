import PropTypes from 'prop-types'
import React from 'react'
import { useIntl } from 'react-intl'

import FilterOptionTemplate from './FilterOptionTemplate'
import FacetItem from './FacetItem'
import { facetOptionShape } from '../../../constants/propTypes'
import { getFilterTitle } from '../../../constants/SearchHelpers'
import useSelectedFilters from './hooks/useSelectedFilters'

/**
 * Search Filter Component.
 */
const SearchFilter = ({
  title = 'Default Title',
  facets = [],
  preventRouteChange = false,
}) => {
  const intl = useIntl()
  const filtersWithSelected = useSelectedFilters(facets)

  return (
    <FilterOptionTemplate
      title={getFilterTitle(title, intl)}
      filters={filtersWithSelected}
    >
      {(facet) => (
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
  /** Prevents changing route when setting filters (uses URL search params instead) */
  preventRouteChange: PropTypes.bool,
}

export default SearchFilter
