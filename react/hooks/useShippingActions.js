import { useEffect, useState } from 'react'
import { useDeliveryPromiseState } from 'vtex.delivery-promise-components/DeliveryPromiseContext'
import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'

import { useFilterNavigator } from '../components/FilterNavigatorContext'
import {
  getPickupInPointIdFromQueryMap,
  hasStoredPickupPreferenceForZip,
  readStoredPickupFriendlyName,
  readStoredPickupPayload,
} from '../utils/pickupInPointLabel'
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

/** True when actionLabel is an i18n message id, not a resolved address/pickup name. */
export const isShippingActionPlaceholder = actionLabel =>
  actionLabel != null && Object.values(placeHolders).includes(actionLabel)

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

  const { zipcode, selectedPickup, pickupSuggestion, city, addressLabel } =
    useDeliveryPromiseState()

  const effectivePickup = selectedPickup ?? pickupSuggestion

  const { query: filterQuery, map: filterMap } = useFilterNavigator()
  const { searchQuery, map: pageMap } = useSearchPage()

  const query = filterQuery ?? searchQuery?.variables?.query
  const map = filterMap ?? pageMap ?? searchQuery?.variables?.map

  useEffect(() => {
    const urlPickupPointId = getPickupInPointIdFromQueryMap(query, map)

    const pickupPointLabel =
      eventIdentifier === 'pickupPointLabel'
        ? (() => {
            if (urlPickupPointId) {
              const fromStorage = readStoredPickupFriendlyName(urlPickupPointId)

              if (fromStorage) {
                return fromStorage
              }

              const ctxId = effectivePickup?.pickupPoint?.id

              if (ctxId != null && String(ctxId) === String(urlPickupPointId)) {
                return effectivePickup.pickupPoint.friendlyName || ''
              }

              return ''
            }

            // No pickup id in URL: prefer last persisted selection (PLP modal or header)
            // over session/context so the label matches the latest pickupPoint chosen anywhere.
            if (hasStoredPickupPreferenceForZip(zipcode)) {
              const stored = readStoredPickupPayload()

              if (stored?.friendlyName) {
                return String(stored.friendlyName)
              }
            }

            if (effectivePickup?.pickupPoint?.friendlyName) {
              return effectivePickup.pickupPoint.friendlyName
            }

            return ''
          })()
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
        setIsPickupSet(
          Boolean(
            urlPickupPointId ||
              effectivePickup?.pickupPoint?.friendlyName ||
              hasStoredPickupPreferenceForZip(zipcode)
          )
        )
      }
    }
  }, [
    actionType,
    city,
    eventIdentifier,
    isAddressDependent,
    map,
    query,
    zipcode,
    selectedPickup,
    pickupSuggestion,
    effectivePickup,
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
