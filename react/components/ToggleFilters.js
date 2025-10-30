import React, { useEffect, useState } from 'react'
import { Toggle } from 'vtex.styleguide'

const ToggleFilters = ({ facets, onChange }) => {
  const [toggleStates, setToggleStates] = useState({})

  useEffect(() => {
    const initialStates = {}

    facets.forEach(facet => {
      initialStates[facet.value] = Boolean(facet.selected)
    })
    setToggleStates(initialStates)
  }, [facets])

  const onToggleChange = (facetValue, isChecked) => {
    const clickedFacet = facets.find(facet => facet.value === facetValue)

    if (!clickedFacet) return

    const currentSelected = Boolean(clickedFacet.selected)

    if (currentSelected === isChecked) {
      return
    }

    if (isChecked) {
      const newStates = {}

      facets.forEach(facet => {
        newStates[facet.value] = facet.value === facetValue
      })
      setToggleStates(newStates)
    } else {
      setToggleStates(prev => ({
        ...prev,
        [facetValue]: false,
      }))
    }

    const updatedFacet = { ...clickedFacet, selected: isChecked }

    onChange(updatedFacet)
  }

  return (
    <div data-testid="toggle-filters">
      {facets.map(facet => (
        <div key={facet.value} className="mb3">
          <Toggle
            checked={toggleStates[facet.value] || false}
            disabled={facet.quantity === 0}
            label={facet.name}
            onChange={eventOrValue => {
              const isChecked =
                typeof eventOrValue === 'boolean'
                  ? eventOrValue
                  : eventOrValue?.target?.checked ?? false

              onToggleChange(facet.value, isChecked)
            }}
            size="small"
          />
        </div>
      ))}
    </div>
  )
}

export default ToggleFilters
