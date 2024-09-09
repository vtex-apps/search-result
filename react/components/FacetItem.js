import React, {
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react'
import { Checkbox } from 'vtex.styleguide'
import { useCssHandles, applyModifiers } from 'vtex.css-handles'
import classNames from 'classnames'
import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'
import { usePixel, usePixelEventCallback } from 'vtex.pixel-manager'
import { useSSR } from 'vtex.render-runtime/react/components/NoSSR'

import { pushFilterManipulationPixelEvent } from '../utils/filterManipulationPixelEvents'
import SettingsContext from './SettingsContext'
import useShouldDisableFacet from '../hooks/useShouldDisableFacet'
import ShippingActionButton from './ShippingActionButton'

const CSS_HANDLES = ['filterItem', 'productCount', 'filterItemTitle']

// These are used to prevent creating a <Checkbox /> with id equal
// to any of these words.
const reservedVariableNames = [
  'global',
  'window',
  'document',
  'self',
  'screen',
  'parent',
]

const shippingActionTypes = {
  delivery: 'DELIVERY',
  'pickup-nearby': 'DELIVERY',
  'pickup-in-point': 'PICKUP_POINT',
}

const eventIdentifiers = {
  DELIVERY: 'addressLabel',
  PICKUP_POINT: 'pickupPointLabel',
}

const placeHolders = {
  DELIVERY: 'Enter location',
  PICKUP_POINT: 'Enter store',
}

const drawerEvent = {
  DELIVERY: 'shipping-option-deliver-to',
  PICKUP_POINT: 'shipping-option-store',
}

const FacetItem = ({
  navigateToFacet,
  facetTitle,
  facet,
  className,
  preventRouteChange,
  showTitle = false,
  showActionButton,
}) => {
  const isSSR = useSSR()
  const { push } = usePixel()

  const actionType = shippingActionTypes[facet.value]
  const eventIdentifier = eventIdentifiers[actionType]

  const [actionLabel, setActionLabel] = useState(placeHolders[actionType])
  const [isAddressSet, setIsAddressSet] = useState(false)
  const [isPickupSet, setIsPickupSet] = useState(false)

  usePixelEventCallback({
    eventId: `shipping-option-${eventIdentifier}`,
    handler: e => {
      if (e?.data?.label) {
        setActionLabel(e.data.label)

        if (eventIdentifier === 'addressLabel') {
          setIsAddressSet(true)
        }

        if (eventIdentifier === 'pickupPointLabel') {
          setIsPickupSet(true)
        }
      } else {
        setActionLabel(placeHolders[actionType])

        if (eventIdentifier === 'addressLabel') {
          setIsAddressSet(false)
        }

        if (eventIdentifier === 'pickupPointLabel') {
          setIsPickupSet(false)
        }
      }
    },
  })

  useEffect(() => {
    if (!isSSR) {
      return
    }

    const windowLabel = window[eventIdentifier]

    if (windowLabel) {
      setActionLabel(windowLabel)

      if (eventIdentifier === 'addressLabel') {
        setIsAddressSet(true)
      }

      if (eventIdentifier === 'pickupPointLabel') {
        setIsPickupSet(true)
      }
    } else {
      setActionLabel(placeHolders[actionType])

      if (eventIdentifier === 'addressLabel') {
        setIsAddressSet(false)
      }

      if (eventIdentifier === 'pickupPointLabel') {
        setIsPickupSet(false)
      }
    }
  }, [actionType, eventIdentifier, isSSR])

  const openDrawer = useCallback(() => {
    push({
      id: drawerEvent[actionType],
    })
  }, [actionType, push])

  const { showFacetQuantity } = useContext(SettingsContext)

  const [selected, setSelected] = useState(facet.selected)
  const handles = useCssHandles(CSS_HANDLES)
  const classes = classNames(
    applyModifiers(handles.filterItem, facet.value),
    { [`${handles.filterItem}--selected`]: facet.selected },
    className,
    'lh-copy w-100'
  )

  const { searchQuery } = useSearchPage()
  const sampling = searchQuery?.facets?.sampling

  const checkBoxId = reservedVariableNames.includes(facet.value)
    ? `filterItem--${facet.key}-${facet.value}`
    : `${facet.key}-${facet.value}`

  // This effect fixes the issue described in this PR
  // https://github.com/vtex-apps/search-result/pull/422
  useEffect(() => {
    if (facet.selected !== selected) {
      setSelected(facet.selected)
    }
    // however, having `selected` as a dependency causes it
    // to always reset back to `facet.selected`. So, we remove it,
    // so only changes in facet.selected affect the state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facet.selected])

  const shouldDisable = useShouldDisableFacet(facet, isAddressSet, isPickupSet)

  const facetLabel = useMemo(() => {
    const labelElement =
      showFacetQuantity && !sampling ? (
        <>
          {facet.name}{' '}
          <span
            data-testid={`facet-quantity-${facet.value}-${facet.quantity}`}
            className={handles.productCount}
          >
            ({facet.quantity})
          </span>
        </>
      ) : showActionButton && actionType && facet.value !== 'pickup-nearby' ? (
        <div className="flex flex-column">
          <span>{facet.name}</span>
          <ShippingActionButton label={actionLabel} openDrawer={openDrawer} />
        </div>
      ) : (
        facet.name
      )

    if (showTitle) {
      return (
        <>
          <span className={handles.filterItemTitle}>{facetTitle}</span>:{' '}
          {labelElement}
        </>
      )
    }

    return labelElement
  }, [
    showFacetQuantity,
    sampling,
    facet.name,
    facet.value,
    facet.quantity,
    handles.productCount,
    handles.filterItemTitle,
    showActionButton,
    actionType,
    actionLabel,
    openDrawer,
    showTitle,
    facetTitle,
  ])

  return (
    <div
      className={classes}
      style={{ hyphens: 'auto', wordBreak: 'break-word' }}
      alt={facet.name}
      title={facet.name}
    >
      <Checkbox
        id={checkBoxId}
        checked={selected}
        label={facetLabel}
        name={facet.name}
        onChange={() => {
          pushFilterManipulationPixelEvent({
            name: facetTitle,
            value: facet.name,
            products: searchQuery?.products ?? [],
            push,
          })

          setSelected(!selected)
          navigateToFacet({ ...facet, title: facetTitle }, preventRouteChange)
        }}
        value={facet.name}
        disabled={shouldDisable}
      />
    </div>
  )
}

export default FacetItem
