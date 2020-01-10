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
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  if (!filters.length) {
    return null
  }

  const title = intl.formatMessage({ id: 'store/search.selected-filters' })
  return (
    <FilterOptionTemplate
      id="selectedFilters"
      title={title}
      filters={filters}
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
}

export default injectIntl(SelectedFilters)
