import classNames from 'classnames'
import React, { useMemo } from 'react'
import { applyModifiers } from 'vtex.css-handles'
import { Checkbox } from 'vtex.styleguide'
import { usePixel } from 'vtex.pixel-manager'

import styles from '../searchResult.css'
import { pushFilterManipulationPixelEvent } from '../utils/filterManipulationPixelEvents'
import useShippingActions from '../hooks/useShippingActions'
import ShippingActionButton from './ShippingActionButton'

const FacetCheckboxListItem = ({
  facet,
  showFacetQuantity,
  sampling,
  facetTitle,
  searchQuery,
  onFilterCheck,
}) => {
  const { push } = usePixel()

  const { actionLabel, actionType, openDrawer, shouldDisable } =
    useShippingActions(facet)

  const showActionButton = !!actionType

  const { name, value: slugifiedName } = facet

  const facetLabel = useMemo(() => {
    let labelElement = facet.name

    if (showFacetQuantity && !sampling) {
      labelElement = `${labelElement} (${facet.quantity})`
    }

    if (showActionButton) {
      labelElement = (
        <div className="flex flex-column">
          <span>{labelElement}</span>
          <ShippingActionButton label={actionLabel} openDrawer={openDrawer} />
        </div>
      )
    }

    return labelElement
  }, [
    showFacetQuantity,
    sampling,
    facet.name,
    facet.quantity,
    showActionButton,
    actionLabel,
    openDrawer,
  ])

  return (
    <div
      className={classNames(
        applyModifiers(styles.filterAccordionItemBox, slugifiedName),
        'pr4 pt3 items-center flex bb b--muted-5'
      )}
      style={{ hyphens: 'auto', wordBreak: 'break-word' }}
    >
      <Checkbox
        disabled={shouldDisable}
        className="mb0"
        checked={facet.selected}
        id={name}
        label={facetLabel}
        name={name}
        onChange={() => {
          pushFilterManipulationPixelEvent({
            name: facetTitle,
            value: name,
            products: searchQuery?.products ?? [],
            push,
          })

          onFilterCheck({ ...facet, title: facetTitle })
        }}
        value={name}
      />
    </div>
  )
}

export default FacetCheckboxListItem
