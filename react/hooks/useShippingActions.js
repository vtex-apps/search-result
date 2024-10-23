import { useCallback, useEffect, useState } from 'react'
import { usePixel, usePixelEventCallback } from 'vtex.pixel-manager'
import { useSSR } from 'vtex.render-runtime/react/components/NoSSR'

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

const drawerEvent = {
  DELIVERY: 'shipping-option-deliver-to',
  PICKUP_POINT: 'shipping-option-store',
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

  const isSSR = useSSR()
  const { push } = usePixel()

  usePixelEventCallback({
    eventId: `shipping-option-${eventIdentifier}`,
    handler: e => {
      if (e?.data?.label) {
        setActionLabel(e.data.label)

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
    },
  })

  useEffect(() => {
    if (!isSSR) {
      return
    }

    const windowLabel = window[eventIdentifier]

    if (windowLabel) {
      setActionLabel(windowLabel)

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
  }, [actionType, eventIdentifier, isSSR, isAddressDependent])

  const openDrawer = useCallback(() => {
    push({
      id: drawerEvent[actionType],
    })
  }, [actionType, push])

  const shouldDisable = useShouldDisableFacet(facet, isAddressSet, isPickupSet)

  if (facet.value === 'pickup-nearby' || facet.value === 'pickup') {
    return {
      actionLabel: null,
      actionType: null,
      openDrawer: null,
      shouldDisable,
    }
  }

  return {
    actionType,
    actionLabel,
    openDrawer,
    shouldDisable,
  }
}

export default useShippingActions
