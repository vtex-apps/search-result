import React, { Fragment } from 'react'

import FacetCheckbox from './FacetCheckbox'

const FacetCheckboxList = ({ title, facets, onFilterCheck }) => {
  return (
    <Fragment>
      {facets.map((facet, index) => (
        <FacetCheckbox
          key={index}
          title={title}
          facet={facet}
          onFilterCheck={onFilterCheck}
        />
      ))}
    </Fragment>
  )
}

export default FacetCheckboxList
