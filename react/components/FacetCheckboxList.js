import classNames from 'classnames'
import React, { useContext, useState, useMemo } from 'react'
import { Checkbox } from 'vtex.styleguide'
import { applyModifiers } from 'vtex.css-handles'

import styles from '../searchResult.css'
import SettingsContext from '../components/SettingsContext'
import { searchSlugify } from '../utils/slug'
import { SearchFilterBar } from './SearchFilterBar'

const useSettings = () => useContext(SettingsContext)

const FacetCheckboxList = ({ facets, onFilterCheck, facetTitle }) => {
  const { thresholdForFacetSearch } = useSettings()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredFacets = useMemo(() => {
    if (thresholdForFacetSearch === undefined || searchTerm === '') {
      return facets
    }
    return facets.filter(
      facet => facet.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
    )
  }, [facets, searchTerm, thresholdForFacetSearch])

  const showSearchBar =
    thresholdForFacetSearch !== undefined &&
    thresholdForFacetSearch < facets.length

  return (
    <>
      {showSearchBar ? (
        <SearchFilterBar name={facetTitle} handleChange={setSearchTerm} />
      ) : null}
      {filteredFacets.map(facet => {
        const { name } = facet
        const slugifiedName = searchSlugify(name)

        return (
          <div
            className={classNames(
              applyModifiers(styles.filterAccordionItemBox, slugifiedName),
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
      })}
    </>
  )
}

export default FacetCheckboxList
