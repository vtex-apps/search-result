import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { RadioGroup } from 'vtex.styleguide'
import { useDeliveryPromiseState } from 'vtex.delivery-promise-components/DeliveryPromiseContext'

import ShippingActionButton from './ShippingActionButton'
import useShippingActions, {
  isShippingActionPlaceholder,
} from '../hooks/useShippingActions'
import {
  isPickupInPointShippingValue,
  resolvePickupInPointFacetForNavigation,
} from '../utils/pickupInPointLabel'

const RadioItem = ({ facet, onOpenPostalCodeModal, onOpenPickupModal }) => {
  const intl = useIntl()

  const { actionLabel, actionType } = useShippingActions(facet)

  return (
    <div>
      <div>{facet.name}</div>
      {actionType ? (
        <ShippingActionButton
          label={
            isShippingActionPlaceholder(actionLabel)
              ? intl.formatMessage({ id: actionLabel })
              : actionLabel ?? ''
          }
          openDrawer={
            actionType === 'DELIVERY'
              ? onOpenPostalCodeModal
              : onOpenPickupModal
          }
        />
      ) : undefined}
    </div>
  )
}

const RadioFilters = ({
  facets,
  onChange,
  onOpenPostalCodeModal,
  onOpenPickupModal,
}) => {
  const {
    selectedPickup,
    pickupSuggestion,
    zipcode,
    pickups = [],
  } = useDeliveryPromiseState()

  const selectedOption = facets.find(facet => facet.selected)
  const lastValue = selectedOption ? selectedOption.value : undefined

  const [selectedValue, setSelectedValue] = useState(lastValue)

  useEffect(() => {
    setSelectedValue(lastValue)
  }, [lastValue])

  const onRadioSelect = e => {
    const { value } = e.currentTarget

    const clickedFacet = facets.find(facet => facet.value === value)

    if (clickedFacet.selected) {
      return
    }

    const resolved = resolvePickupInPointFacetForNavigation(
      clickedFacet,
      selectedPickup,
      { pickupSuggestion, zipcode }
    )

    if (resolved.modal) {
      onOpenPickupModal?.()

      return
    }

    setSelectedValue(value)
    onChange(resolved.facet)
  }

  return (
    <RadioGroup
      data-testid="radio-filters"
      hideBorder
      size="small"
      name={facets[0]?.key || 'radio-group'}
      options={facets.map(facet => ({
        id: facet.value,
        value: facet.value,
        label: (
          <RadioItem
            facet={facet}
            onOpenPostalCodeModal={onOpenPostalCodeModal}
            onOpenPickupModal={onOpenPickupModal}
          />
        ),
        disabled: isPickupInPointShippingValue(facet.value)
          ? pickups.length === 0
          : facet.quantity === 0,
      }))}
      value={selectedValue}
      onChange={onRadioSelect}
    />
  )
}

export default RadioFilters
