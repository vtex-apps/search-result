import classNames from 'classnames'
import React from 'react'
import { Checkbox } from 'vtex.styleguide'
import { applyModifiers } from 'vtex.css-handles'
import slugify from 'slugify'

import styles from '../searchResult.css'

const FacetCheckboxList = ({ facets, onFilterCheck, facetTitle }) => {
  return facets.map(facet => {
    const { name } = facet
    const slugName = slugify(name, { lower: true, remove: /[*+~.()'"!:@]/g })

    return (
      <div
        className={classNames(
          applyModifiers(styles.filterAccordionItemBox, slugName),
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
          onChange={() => onFilterCheck({ ...facet, title: facetTitle })}
          value={name}
        />
      </div>
    )
  })
}

export default FacetCheckboxList
