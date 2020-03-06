import React, { useRef } from 'react'
import classNames from 'classnames'
import { Checkbox } from 'vtex.styleguide'

import styles from '../searchResult.css'

const FacetCheckbox = ({ title, facet, onFilterCheck }) => {
  const { name } = facet
  const selected = useRef(facet.selected)

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
        checked={selected.current}
        id={name}
        label={name}
        name={name}
        onChange={() => {
          selected.current = !selected.current
          onFilterCheck(title, facet)
        }}
        value={name}
      />
    </div>
  )
}

export default FacetCheckbox
