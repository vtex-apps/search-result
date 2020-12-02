import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'
import { MAP_VALUES_SEP } from '../constants'

export default function useShouldDisableFacet(facet) {
  const { selectedFacets, map } = useSearchPage()

  if (!facet.selected) {
    return false
  }

  if (map && map.split(MAP_VALUES_SEP).includes('ft')) {
    return false
  }

  if (selectedFacets && selectedFacets.length === 1) {
    const [selectedFacet] = selectedFacets

    return (
      selectedFacet.key === facet.key && selectedFacet.value === facet.value
    )
  }

  return false
}
