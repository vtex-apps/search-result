import classNames from 'classnames'
import React from 'react'
import { Checkbox } from 'vtex.styleguide'

import styles from '../searchResult.css'

const FacetCheckboxList = ({ title, facets, onFilterCheck }) => {
  console.log('facet2', facets)
  return facets.map(facet => {
    const { name } = facet

    return (
      <div
        className={classNames(
          styles.filterAccordionItemBox,
          'pr4 pt3 items-center flex bb b--muted-5'
        )}
        key={name}
        style={{ hyphens: 'auto', wordBreak: 'break-word' }}
      >
        <Checkbox
          className="mb0"
          checked={facet.selected}
          id={name}
          label={name}
          name={name}
          onChange={() => {
            console.log('CLICOU!')
            onFilterCheck(title, facet)
            console.log('FACET DENOVO', facet)
          }}
          value={name}
        />
      </div>
    )
  })
}

export default FacetCheckboxList
