import classNames from 'classnames'
import React from 'react'
import { Checkbox } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'

import useSelectedFilters from '../hooks/useSelectedFilters'

const CSS_HANDLES = ['filterAccordionItemBox']

const FacetCheckboxList = ({ facets, onFilterCheck }) => {
  const facetsWithSelected = useSelectedFilters(facets)
  const handles = useCssHandles(CSS_HANDLES)

  return facetsWithSelected.map(facet => {
    const { name } = facet

    return (
      <div
        className={classNames(
          handles.filterAccordionItemBox,
          'pr4 pt3 items-center flex bb b--muted-5'
        )}
        key={name}
        style={{hyphens: 'auto', wordBreak: 'break-word'}}
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
