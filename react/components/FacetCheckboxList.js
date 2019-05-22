import classNames from 'classnames'
import React from 'react'
import { Checkbox } from 'vtex.styleguide'

import useSelectedFilters from '../hooks/useSelectedFilters'
import styles from '../searchResult.css'

const FacetCheckboxList = ({ facets, onFilterCheck }) => {
  const facetsWithSelected = useSelectedFilters(facets)

  return facetsWithSelected.map(facet => {
    const { name } = facet

    return (
      <div
        className={classNames(
          styles.filterAccordionItemBox,
          'pr4 pt3 items-center flex bb b--muted-5'
        )}
        key={name}
      >
        <Checkbox
          className="mb0"
          checked={facet.selected}
          id={name}
          label={name}
          name={name}
          onChange={() => onFilterCheck(facet)}
          value={name}
        />
      </div>
    )
  })
}

export default FacetCheckboxList
