import React, { useEffect, useState } from 'react'
import { Toggle } from 'vtex.styleguide'
import { useIntl } from 'react-intl'

export const toggleFiltersValue = {
  'next-day': 'store/search.filter.dynamic-estimate.next-day.name',
  'same-day': 'store/search.filter.dynamic-estimate.same-day.name',
}

const ToggleFilters = ({ facets, onChange }) => {
  const [toggleStates, setToggleStates] = useState({})
  const intl = useIntl()

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
            label={
              toggleFiltersValue[facet.name]
                ? intl.formatMessage({ id: toggleFiltersValue[facet.name] })
                : facet.name
            }
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

// TO-DO:
// - Testar em ambiente mobile
// - Verificar acessibilidade
// - Verificar performance com muitos itens
// - Refatorar o que foi feito se necessário (parece ter mtas regras de negócio aqui que não deveriam estar)
// - Achar um jeito de talvez agrupar a lógica do radio com toggle por que são bem parecidas
