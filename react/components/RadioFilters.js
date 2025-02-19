import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { RadioGroup } from 'vtex.styleguide'

import ShippingActionButton from './ShippingActionButton'
import useShippingActions from '../hooks/useShippingActions'

const RadioItem = ({ facet }) => {
  const intl = useIntl()

  const { actionLabel, actionType, openDrawer } = useShippingActions(facet)

  return (
    <div>
      <div>{facet.name}</div>
      {actionType ? (
        <ShippingActionButton
          label={intl.formatMessage({ id: actionLabel ?? 'none' })}
          openDrawer={openDrawer}
        />
      ) : undefined}
    </div>
  )
}

const RadioFilters = ({ facets, onChange }) => {
  const selectedOption = facets.find(facet => facet.selected)
  const lastValue = selectedOption ? selectedOption.value : undefined

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
    <RadioGroup
      hideBorder
      size="small"
      name="shipping"
      options={facets.map(facet => ({
        id: facet.value,
        value: facet.value,
        label: <RadioItem facet={facet} />,
        disabled: facet.quantity === 0,
      }))}
      value={selectedValue}
      onChange={onRadioSelect}
    />
  )
}

export default RadioFilters
