import classNames from 'classnames'
import React, { useState, useContext } from 'react'
import { Checkbox } from 'vtex.styleguide'

import useSelectedFilters from '../hooks/useSelectedFilters'
import styles from '../searchResult.css'
import { useSortFacets } from '../constants/SearchHelpers'
import SettingsContext from './SettingsContext'
import SearchFilterBar from './SearchFilterBar'

const FacetCheckboxList = ({ facets, onFilterCheck, title }) => {
  const facetsWithSelected = useSelectedFilters(facets)
  const { orderFacetsBy, showFacetSearch, showFacetQuantity } = useContext(
    SettingsContext
  )
  const [searchTerm, setSearchTerm] = useState('')
  const sortFunc = useSortFacets(orderFacetsBy)

  return (
    <>
      {showFacetSearch ? (
        <SearchFilterBar title={title} handleChange={setSearchTerm} />
      ) : null}
      {facetsWithSelected
        .filter(
          filter =>
            searchTerm === '' ||
            filter.name.toLowerCase().indexOf(searchTerm) > -1
        )
        .sort(sortFunc)
        .map(facet => {
          const { name, quantity } = facet

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
                label={showFacetQuantity ? `${name} (${quantity})` : name}
                name={name}
                onChange={() => onFilterCheck(facet)}
                value={name}
              />
            </div>
          )
        })}
    </>
  )
}

export default FacetCheckboxList
