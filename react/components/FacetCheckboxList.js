import React, { useContext, useState, useMemo } from 'react'
import { useRuntime } from 'vtex.render-runtime'
import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'

import SettingsContext from './SettingsContext'
import { SearchFilterBar } from './SearchFilterBar'
import { FACETS_RENDER_THRESHOLD } from '../constants/filterConstants'
import ShowMoreFilterButton from './ShowMoreFilterButton'
import FacetCheckboxListItem from './FacetCheckboxListItem'

const useSettings = () => useContext(SettingsContext)

const FacetCheckboxList = ({
  facets,
  onFilterCheck,
  facetTitle,
  quantity,
  truncateFilters,
  navigationType,
  truncatedFacetsFetched,
  setTruncatedFacetsFetched,
  showActionButton,
}) => {
  const { searchQuery } = useSearchPage()
  const { showFacetQuantity } = useContext(SettingsContext)
  const { getSettings } = useRuntime()
  const { thresholdForFacetSearch } = useSettings()
  const [searchTerm, setSearchTerm] = useState('')
  const [truncated, setTruncated] = useState(true)
  const isLazyFacetsFetchEnabled =
    getSettings('vtex.store')?.enableFiltersFetchOptimization

  const sampling = searchQuery?.facets?.sampling

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
    // The "+ 1" prevents from truncating a single value
    quantity > FACETS_RENDER_THRESHOLD + 1

  const endSlice =
    shouldTruncate && truncated
      ? FACETS_RENDER_THRESHOLD
      : filteredFacets.length

  const showSearchBar =
    thresholdForFacetSearch !== undefined &&
    thresholdForFacetSearch < facets.length

  const openTruncated = value => {
    if (isLazyFacetsFetchEnabled && !truncatedFacetsFetched) {
      setTruncatedFacetsFetched(true)
    }

    setTruncated(value)
  }

  return (
    <>
      {showSearchBar ? (
        <SearchFilterBar name={facetTitle} handleChange={setSearchTerm} />
      ) : null}
      {filteredFacets.slice(0, endSlice).map(facet => {
        return (
          <FacetCheckboxListItem
            facet={facet}
            facetTitle={facetTitle}
            onFilterCheck={onFilterCheck}
            sampling={sampling}
            searchQuery={searchQuery}
            showFacetQuantity={showFacetQuantity}
            key={facet.name}
            showActionButton={showActionButton}
          />
        )
      })}
      {shouldTruncate && (
        <ShowMoreFilterButton
          quantity={quantity - FACETS_RENDER_THRESHOLD}
          truncated={truncated}
          toggleTruncate={() => openTruncated(prevTruncated => !prevTruncated)}
        />
      )}
    </>
  )
}

export default FacetCheckboxList
