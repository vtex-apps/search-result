import React from 'react'
import PropTypes from 'prop-types'

import SearchFilter from './SearchFilter'
import PriceRange from './PriceRange'
import { useRenderOnView } from '../hooks/useRenderOnView'

const LAZY_RENDER_THRESHOD = 3

const AvailableFilters = ({ filters = [], ...props }) =>
  filters.map((filter, i) => (
    <Filter
      filter={filter}
      {...props}
      key={filter.title}
      lazyRender={i >= LAZY_RENDER_THRESHOD}
    />
  ))

const Filter = ({
  filter,
  priceRange,
  preventRouteChange,
  initiallyCollapsed,
  navigateToFacet,
  lazyRender,
}) => {
  const { hasBeenViewed, dummyElement } = useRenderOnView({ lazyRender })

  if (!hasBeenViewed) {
    return dummyElement
  }

  const { type, title, facets, oneSelectedCollapse = false } = filter

  switch (type) {
    case 'PriceRanges':
      return (
        <PriceRange
          key={title}
          title={title}
          facets={facets}
          priceRange={priceRange}
          preventRouteChange={preventRouteChange}
        />
      )
    default:
      return (
        <SearchFilter
          key={title}
          title={title}
          facets={facets}
          oneSelectedCollapse={oneSelectedCollapse}
          preventRouteChange={preventRouteChange}
          initiallyCollapsed={initiallyCollapsed}
          navigateToFacet={navigateToFacet}
        />
      )
  }
}

AvailableFilters.propTypes = {
  /** Filters to be displayed */
  filters: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      type: PropTypes.string,
      oneSelectedCollapse: PropTypes.bool,
    })
  ),
  /** Price range query parameter */
  priceRange: PropTypes.string,
  /** Prevent route changes */
  preventRouteChange: PropTypes.bool,
  initiallyCollapsed: PropTypes.bool,
}

export default AvailableFilters
