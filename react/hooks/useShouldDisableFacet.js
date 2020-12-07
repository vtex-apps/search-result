import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'
import { MAP_VALUES_SEP } from '../constants'

export default function useShouldDisableFacet(facet) {
  const { map } = useSearchPage()

  if (!facet.selected || !map) {
    return false
  }

  const mapArray = map.split(MAP_VALUES_SEP)

  if (mapArray.includes('ft')) {
    return false
  }

  if (mapArray.length === 1) {
    return true
  }

  return false
}
