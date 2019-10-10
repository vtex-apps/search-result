import PropTypes from 'prop-types'
import React from 'react'
import { intlShape, injectIntl } from 'react-intl'

import FacetItem from './FacetItem'
import FilterOptionTemplate from './FilterOptionTemplate'
import { facetOptionShape } from '../constants/propTypes'
import styles from '../searchResult.css'

/**
 * Search Filter Component.
 */
const SelectedFilters = ({
  filters = [],
  intl,
  preventRouteChange = false,
}) => {
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
          key={facet.name}
          facet={facet}
          className={styles.selectedFilterItem}
          preventRouteChange={preventRouteChange}
        />
      )}
    </FilterOptionTemplate>
  )
}

SelectedFilters.propTypes = {
  /** Selected filters. */
  filters: PropTypes.arrayOf(facetOptionShape).isRequired,
  /** Intl instance. */
  intl: intlShape,
  /** Prevent route changes */
  preventRouteChange: PropTypes.boolean,
}

export default injectIntl(SelectedFilters)
