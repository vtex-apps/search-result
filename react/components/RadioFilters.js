import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { RadioGroup } from 'vtex.styleguide'
import PostalCodeModal from 'vtex.shipping-option-components/PostalCodeModal'
import PickupModal from 'vtex.shipping-option-components/PickupModal'

import ShippingActionButton from './ShippingActionButton'
import useShippingActions from '../hooks/useShippingActions'

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

const RadioFilters = ({ facets, onChange }) => {
  const selectedOption = facets.find(facet => facet.selected)
  const lastValue = selectedOption ? selectedOption.value : undefined
  const [isPostalCodeModalOpen, setIsPostalCodeModalOpen] = useState(false)
  const [isPickupModalOpen, setisPickupModalOpen] = useState(false)

  const [selectedValue, setSelectedValue] = useState(lastValue)

  useEffect(() => {
    setSelectedValue(lastValue)
  }, [lastValue])

  const onRadioSelect = e => {
    const { value } = e.currentTarget

    setSelectedValue(value)

    const clickedFacet = facets.find(facet => facet.value === value)

    if (clickedFacet.selected) {
      return
    }

    onChange(clickedFacet)
  }

  return (
    <>
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
              onOpenPostalCodeModal={() => setIsPostalCodeModalOpen(true)}
              onOpenPickupModal={() => setisPickupModalOpen(true)}
            />
          ),
          disabled: facet.quantity === 0,
        }))}
        value={selectedValue}
        onChange={onRadioSelect}
      />
      <PostalCodeModal
        isOpen={isPostalCodeModalOpen}
        onClose={() => setIsPostalCodeModalOpen(false)}
      />
      <PickupModal
        isOpen={isPickupModalOpen}
        onClose={() => setisPickupModalOpen(false)}
      />
    </>
  )
}

export default RadioFilters
