import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'

export default function useShouldDisableFacet(facet) {
  const { selectedFacets } = useSearchPage()

  if (!facet.selected) {
    return false
  }

  if (selectedFacets.length === 1) {
    const [selectedFacet] = selectedFacets

    return (
      selectedFacet.key === facet.key && selectedFacet.value === facet.value
    )
  }

  return false
}
