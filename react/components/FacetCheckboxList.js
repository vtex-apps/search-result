import classNames from 'classnames'
import React, { useContext, useState, useMemo } from 'react'
import { Checkbox } from 'vtex.styleguide'
import { applyModifiers } from 'vtex.css-handles'

import styles from '../searchResult.css'
import SettingsContext from '../components/SettingsContext'
import { searchSlugify } from '../utils/slug'
import { SearchFilterBar } from './SearchFilterBar'
import { FACETS_RENDER_THRESHOLD } from '../constants/filterConstants'
import ShowMoreFilterButton from './ShowMoreFilterButton'

const useSettings = () => useContext(SettingsContext)

const FacetCheckboxList = ({
  facets,
  onFilterCheck,
  facetTitle,
  truncateFilters,
  navigationType,
}) => {
  const { showFacetQuantity } = useContext(SettingsContext)
  const { thresholdForFacetSearch } = useSettings()
  const [searchTerm, setSearchTerm] = useState('')
  const [truncated, setTruncated] = useState(true)

  const filteredFacets = useMemo(() => {
    if (thresholdForFacetSearch === undefined || searchTerm === '') {
      return facets
    }
    return facets.filter(
      facet => facet.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
    )
  }, [facets, searchTerm, thresholdForFacetSearch])

  const shouldTruncate =
    navigationType === 'collapsible' &&
    truncateFilters &&
    filteredFacets.length > FACETS_RENDER_THRESHOLD + 1

  const endSlice =
    shouldTruncate && truncated
      ? FACETS_RENDER_THRESHOLD
      : filteredFacets.length

  const showSearchBar =
    thresholdForFacetSearch !== undefined &&
    thresholdForFacetSearch < facets.length

  return (
    <>
      {showSearchBar ? (
        <SearchFilterBar name={facetTitle} handleChange={setSearchTerm} />
      ) : null}
      {filteredFacets.slice(0, endSlice).map(facet => {
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
              label={
                showFacetQuantity
                  ? `${facet.name} (${facet.quantity})`
                  : facet.name
              }
              name={name}
              onChange={() => onFilterCheck({ ...facet, title: facetTitle })}
              value={name}
            />
          </div>
        )
      })}
      {shouldTruncate && (
        <ShowMoreFilterButton
          quantity={facets.length - FACETS_RENDER_THRESHOLD}
          truncated={truncated}
          toggleTruncate={() => setTruncated(!truncated)}
        />
      )}
    </>
  )
}

export default FacetCheckboxList
