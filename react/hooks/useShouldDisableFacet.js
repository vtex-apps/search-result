import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'

import { MAP_VALUES_SEP } from '../constants'

export default function useShouldDisableFacet(
  facet,
  isAddressSet,
  isPickupSet
) {
  const { map } = useSearchPage()
  
  if (
    (facet.value === 'delivery' ||
      facet.value === 'pickup-nearby' ||
      facet.value === 'pickup') &&
    !isAddressSet
  ) {
    return true
  }

  if (facet.value === 'pickup-in-point' && !isPickupSet) {
    return true
  }

  if(facet.quantity === 0) {
    return true
  }
  
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
