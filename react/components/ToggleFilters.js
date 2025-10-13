import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { Toggle } from 'vtex.styleguide'

import ShippingActionButton from './ShippingActionButton'
import useShippingActions from '../hooks/useShippingActions'

const ToggleItem = ({ facet, onOpenPostalCodeModal, onOpenPickupModal }) => {
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

const ToggleFilters = ({
  facets,
  onChange,
  onOpenPostalCodeModal,
  onOpenPickupModal,
}) => {
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
            label={
              <ToggleItem
                facet={facet}
                onOpenPostalCodeModal={onOpenPostalCodeModal}
                onOpenPickupModal={onOpenPickupModal}
              />
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
// - Documentação será necessário?
// - Refatorar o que foi feito se necessário (parece ter mtas regras de negócio aqui que não deveriam estar)
// - Revisar os testes unitários
// - Essa parte de forçar booleano ainda é necessário?
// - Achar um jeito de talvez agrupar a lógica do radio com toggle por que são bem parecidas
// - Criar labels para same-day e next-day por que essas strings não existem no intl (?)
