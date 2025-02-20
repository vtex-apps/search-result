import React, { useContext, useState, useEffect, useMemo } from 'react'
import { Checkbox } from 'vtex.styleguide'
import { useCssHandles, applyModifiers } from 'vtex.css-handles'
import classNames from 'classnames'
import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'
import { usePixel } from 'vtex.pixel-manager'
import { useIntl } from 'react-intl'

import { pushFilterManipulationPixelEvent } from '../utils/filterManipulationPixelEvents'
import SettingsContext from './SettingsContext'
import ShippingActionButton from './ShippingActionButton'
import useShippingActions from '../hooks/useShippingActions'

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

const FacetItem = ({
  navigateToFacet,
  facetTitle,
  facet,
  className,
  preventRouteChange,
  showTitle = false,
}) => {
  const intl = useIntl()
  const { push } = usePixel()

  const { actionLabel, actionType, openDrawer, shouldDisable } =
    useShippingActions(facet)

  const showActionButton = !!actionType

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

  const facetLabel = useMemo(() => {
    let labelElement = facet.name

    if (showFacetQuantity && !sampling) {
      labelElement = (
        <>
          {labelElement}{' '}
          <span
            data-testid={`facet-quantity-${facet.value}-${facet.quantity}`}
            className={handles.productCount}
          >
            ({facet.quantity})
          </span>
        </>
      )
    }

    if (showActionButton) {
      labelElement = (
        <div>
          <div>{labelElement}</div>
          <ShippingActionButton
            label={intl.formatMessage({ id: actionLabel })}
            openDrawer={openDrawer}
          />
        </div>
      )
    }

    if (showTitle) {
      labelElement = (
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
    actionLabel,
    openDrawer,
    showTitle,
    facetTitle,
    intl,
  ])

  return (
    <div
      className={classes}
      style={{ hyphens: 'auto', wordBreak: 'break-word', alignSelf: 'center' }}
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
        disabled={shouldDisable}
        value={facet.value}
        facetKey={facet.key}
        isClicked={selected.toString()}
        queryText={searchQuery.variables?.query === undefined ? "" : searchQuery.variables?.query}
        />
    </div>
  )
}

export default FacetItem
