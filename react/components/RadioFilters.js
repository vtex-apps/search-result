import React, { useEffect, useState, useCallback } from 'react'
import { useIntl } from 'react-intl'
import { RadioGroup } from 'vtex.styleguide'
import { useShippingOptionState } from 'vtex.shipping-option-components/ShippingOptionContext'

import ShippingActionButton from './ShippingActionButton'
import useShippingActions from '../hooks/useShippingActions'
import setCookie from '../utils/setCookie'
import getCookie from '../utils/getCookie'

const LAST_SHIPPING_FACET_SELECTED = 'lastShippingFacetSelected'

const RadioItem = ({ facet, onOpenPostalCodeModal, onOpenPickupModal }) => {
  const intl = useIntl()

  const { actionLabel, actionType } = useShippingActions(facet)

  return (
    <div>
      <div>{facet.name}</div>
      {actionType ? (
        <ShippingActionButton
          label={intl.formatMessage({ id: actionLabel ?? 'none' })}
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
  const selectedOption = facets.find(facet => facet.selected)
  const lastValue = selectedOption ? selectedOption.value : undefined

  const [selectedValue, setSelectedValue] = useState(lastValue)

  const { zipcode, selectedPickup } = useShippingOptionState()

  useEffect(() => {
    setSelectedValue(lastValue)
    if (lastValue) {
      setCookie(LAST_SHIPPING_FACET_SELECTED, lastValue)
    }
  }, [lastValue])

  useEffect(() => {
    const lastSelected = getCookie(LAST_SHIPPING_FACET_SELECTED)

    if (lastSelected) {
      return
    }

    let globalValue

    if (zipcode) {
      globalValue = 'delivery'
    }

    if (selectedPickup) {
      globalValue = 'pickup-in-point'
    }

    onSelectFacet(globalValue)
  }, [onSelectFacet, selectedPickup, zipcode])

  const onSelectFacet = useCallback(
    value => {
      setSelectedValue(value)

      const clickedFacet = facets.find(facet => facet.value === value)

      if (clickedFacet?.selected) {
        return
      }

      onChange(clickedFacet)
    },
    [facets, onChange]
  )

  return (
    <RadioGroup
      hideBorder
      size="small"
      name="shipping"
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
        disabled: facet.quantity === 0,
      }))}
      value={selectedValue}
      onChange={({ currentTarget }) => {
        onSelectFacet(currentTarget.value)
      }}
    />
  )
}

export default RadioFilters
