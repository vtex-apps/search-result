import { useDeliveryPromiseState } from 'vtex.delivery-promise-components/DeliveryPromiseContext'
import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'

import { MAP_VALUES_SEP } from '../constants'
import { isPickupInPointShippingValue } from '../utils/pickupInPointLabel'

export default function useShouldDisableFacet(
  facet,
  isAddressSet,
  isPickupSet
) {
  const { map } = useSearchPage()
  const { pickups } = useDeliveryPromiseState()

  if (
    (facet.value === 'delivery' ||
      facet.value === 'pickup-nearby' ||
      facet.value === 'pickup') &&
    !isAddressSet
  ) {
    return true
  }

  if (isPickupInPointShippingValue(facet.value) && !isPickupSet) {
    return true
  }

  if (isPickupInPointShippingValue(facet.value)) {
    if (!pickups || pickups.length === 0) {
      return true
    }
  } else if (facet.quantity === 0) {
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
