import { useEffect, useState } from 'react'
import { useShippingOptionState } from 'vtex.shipping-option-components/ShippingOptionContext'

import useShouldDisableFacet from './useShouldDisableFacet'

const shippingActionTypes = {
  delivery: 'DELIVERY',
  'pickup-nearby': 'DELIVERY',
  pickup: 'DELIVERY',
  'pickup-in-point': 'PICKUP_POINT',
}

const eventIdentifiers = {
  DELIVERY: 'addressLabel',
  PICKUP_POINT: 'pickupPointLabel',
}

const placeHolders = {
  DELIVERY: 'store/search.filter.shipping.action-button.delivery',
  PICKUP_POINT: 'store/search.filter.shipping.action-button.pickup-in-point',
}

const addressDependentValues = [
  'delivery',
  'pickup-in-point',
  'pickup-nearby',
  'pickup',
]

const useShippingActions = facet => {
  const actionType = shippingActionTypes[facet.value]
  const eventIdentifier = actionType ? eventIdentifiers[actionType] : null

  const [actionLabel, setActionLabel] = useState(placeHolders[actionType])
  const [isAddressSet, setIsAddressSet] = useState(false)
  const [isPickupSet, setIsPickupSet] = useState(false)

  const isAddressDependent =
    addressDependentValues.findIndex(value => facet.value === value) > -1

  const { zipcode, selectedPickup, city, addressLabel } =
    useShippingOptionState()

  useEffect(() => {
    const pickupPointLabel = selectedPickup
      ? selectedPickup.pickupPoint.friendlyName
      : ''

    const label =
      eventIdentifier === 'pickupPointLabel' ? pickupPointLabel : addressLabel

    if (label) {
      setActionLabel(label)

      if (isAddressDependent) {
        setIsAddressSet(true)
      }

      if (eventIdentifier === 'pickupPointLabel') {
        setIsPickupSet(true)
      }
    } else {
      setActionLabel(placeHolders[actionType])

      if (isAddressDependent) {
        setIsAddressSet(false)
      }

      if (eventIdentifier === 'pickupPointLabel') {
        setIsPickupSet(false)
      }
    }
  }, [
    actionType,
    city,
    eventIdentifier,
    isAddressDependent,
    zipcode,
    selectedPickup,
    addressLabel,
  ])

  const shouldDisable = useShouldDisableFacet(facet, isAddressSet, isPickupSet)

  if (facet.value === 'pickup-nearby' || facet.value === 'pickup') {
    return {
      actionLabel: null,
      actionType: null,
      shouldDisable,
    }
  }

  return {
    actionType,
    actionLabel,
    shouldDisable,
  }
}

export default useShippingActions
