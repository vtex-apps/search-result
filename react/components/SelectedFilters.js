import PropTypes from 'prop-types'
import React, { useContext } from 'react'
import { useIntl } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import FacetItem from './FacetItem'
import FilterOptionTemplate from './FilterOptionTemplate'
import { facetOptionShape } from '../constants/propTypes'
import SettingsContext from './SettingsContext'

const CSS_HANDLES = ['selectedFilterItem']

/**
 * Search Filter Component.
 */
const SelectedFilters = ({
  map,
  filters = [],
  preventRouteChange = false,
  navigateToFacet,
}) => {
  const intl = useIntl()
  const handles = useCssHandles(CSS_HANDLES)
  const { showFacetTitle } = useContext(SettingsContext)

  const visibleFilters = filters
    .filter(filter => !filter.hidden)
    .filter(filter => filter.key !== 'shipping')

  if (!visibleFilters.length) {
    return null
  }

  const title = intl.formatMessage({ id: 'store/search.selected-filters' })

  return (
    <FilterOptionTemplate
      id="selectedFilters"
      title={title}
      filters={visibleFilters}
      collapsable={false}
      selected
    >
      {facet => {
        return (
          <FacetItem
            map={map}
            key={facet.name}
            showTitle={showFacetTitle}
            facetTitle={facet.title}
            facet={facet}
            className={handles.selectedFilterItem}
            preventRouteChange={preventRouteChange}
            navigateToFacet={navigateToFacet}
          />
        )
      }}
    </FilterOptionTemplate>
  )
}

SelectedFilters.propTypes = {
  filterTitle: PropTypes.string,
  /** Legacy search map */
  map: PropTypes.string,
  /** Selected filters. */
  filters: PropTypes.arrayOf(facetOptionShape).isRequired,
  /** Prevent route changes */
  preventRouteChange: PropTypes.bool,
  navigateToFacet: PropTypes.func,
}

export default SelectedFilters
