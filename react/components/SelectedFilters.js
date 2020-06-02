import PropTypes from 'prop-types'
import React from 'react'
import { intlShape, injectIntl } from 'react-intl'

import FacetItem from './FacetItem'
import FilterOptionTemplate from './FilterOptionTemplate'
import { facetOptionShape } from '../constants/propTypes'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = ['selectedFilterItem']

/**
 * Search Filter Component.
 */
const SelectedFilters = ({
  map,
  filters = [],
  intl,
  preventRouteChange = false,
  navigateToFacet,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  if (!filters.length) {
    return null
  }

  const visibleFilters = filters.filter(filter => !filter.hidden)

  const title = intl.formatMessage({ id: 'store/search.selected-filters' })
  return (
    <FilterOptionTemplate
      id="selectedFilters"
      title={title}
      filters={visibleFilters}
      collapsable={false}
      selected
    >
      {facet => (
        <FacetItem
          map={map}
          key={facet.name}
          facetTitle={facet.title}
          facet={facet}
          className={handles.selectedFilterItem}
          preventRouteChange={preventRouteChange}
          navigateToFacet={navigateToFacet}
        />
      )}
    </FilterOptionTemplate>
  )
}

SelectedFilters.propTypes = {
  filterTitle: PropTypes.string,
  /** Legacy search map */
  map: PropTypes.string,
  /** Selected filters. */
  filters: PropTypes.arrayOf(facetOptionShape).isRequired,
  /** Intl instance. */
  intl: intlShape,
  /** Prevent route changes */
  preventRouteChange: PropTypes.bool,
  navigateToFacet: PropTypes.func,
}

export default injectIntl(SelectedFilters)
