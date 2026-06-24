import React, { useEffect, useState } from 'react'
import { Toggle } from 'vtex.styleguide'

const ToggleFilters = ({ facets, onChange }) => {
  const [toggleStates, setToggleStates] = useState({})

  // `facets` is a new array reference on every render, so we sync the local
  // (optimistic) state only when the actual selected state of the facets
  // changes. Depending on `facets` directly would re-run this effect on every
  // render and clobber the optimistic update with stale data while a
  // navigation/refetch is still in flight, making the toggle flicker off.
  const facetsSelectionSignature = facets
    .map(facet => `${facet.value}:${facet.selected ? 1 : 0}`)
    .join('|')

  useEffect(() => {
    const initialStates = {}

    facets.forEach(facet => {
      initialStates[facet.value] = Boolean(facet.selected)
    })
    setToggleStates(initialStates)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facetsSelectionSignature])

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

    // Pass the facet with its CURRENT selected state. The navigation layer
    // uses a single convention (selected => remove, not selected => add), so
    // toggles must not pre-invert here like they used to.
    onChange({ ...clickedFacet })
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
