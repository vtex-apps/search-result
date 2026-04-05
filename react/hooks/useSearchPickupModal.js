import React, { useCallback } from 'react'
import { useIntl } from 'react-intl'
import {
  useDeliveryPromiseDispatch,
  useDeliveryPromiseState,
} from 'vtex.delivery-promise-components/DeliveryPromiseContext'
import PickupModalPresentational from 'vtex.delivery-promise-components/PickupModalPresentational'

import { SHIPPING_TITLE } from '../utils/getFilters'
import { persistPickupInPointForSearch } from '../utils/pickupInPointLabel'

/**
 * PLP pickup modal: same postal flow as delivery-promise PickupModal (UPDATE_ZIPCODE,
 * session + pickups), without full-page reload. Pickup confirm → localStorage + facet navigation.
 */
const useSearchPickupModal = ({ navigateToFacet, isOpen, onClose }) => {
  const intl = useIntl()
  const dispatch = useDeliveryPromiseDispatch()
  const { zipcode, pickups, selectedPickup, isLoading, submitErrorMessage } =
    useDeliveryPromiseState()

  const handleSubmitZip = useCallback(
    zipcodeValue => {
      dispatch({
        type: 'UPDATE_ZIPCODE',
        args: { zipcode: zipcodeValue?.trim?.() ?? '', reload: false },
      })
    },
    [dispatch]
  )

  const handleSelectPickup = useCallback(
    pickup => {
      const zipForPersist = (zipcode?.trim() || '').trim()

      if (zipForPersist) {
        persistPickupInPointForSearch(pickup, zipForPersist)
      }

      const facet = {
        key: 'shipping',
        map: 'shipping',
        name: pickup.pickupPoint.friendlyName,
        value: `pickup-in-point-${pickup.pickupPoint.id}`,
        selected: false,
        quantity: 1,
        title: intl.formatMessage({ id: SHIPPING_TITLE }),
      }

      navigateToFacet(facet)
      onClose()
    },
    [intl, navigateToFacet, onClose, zipcode]
  )

  const pickupModal = (
    <PickupModalPresentational
      isOpen={isOpen}
      onClose={onClose}
      pickupProps={{
        onSelectPickup: handleSelectPickup,
        onSubmit: handleSubmitZip,
        pickups,
        inputErrorMessage: submitErrorMessage?.message,
        selectedPickup,
        selectedZipcode: zipcode,
        isLoading,
      }}
    />
  )

  return { pickupModal }
}

export default useSearchPickupModal
