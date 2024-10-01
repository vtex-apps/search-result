import classNames from 'classnames'
import React from 'react'
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
        label={
          showFacetQuantity && !sampling ? (
            `${facet.name} (${facet.quantity})`
          ) : showActionButton && actionType ? (
            <div className="flex flex-column">
              <span>{facet.name}</span>
              <ShippingActionButton
                label={actionLabel}
                openDrawer={openDrawer}
              />
            </div>
          ) : (
            facet.name
          )
        }
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
