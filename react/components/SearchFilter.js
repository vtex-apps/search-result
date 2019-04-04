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
const SearchFilter = ({ title = 'Default Title', facets = [], intl }) => {
  return (
    <FilterOptionTemplate title={getFilterTitle(title, intl)} filters={facets}>
      {facet => <FacetItem key={facet.name} facet={facet} />}
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
}

export default injectIntl(SearchFilter)
