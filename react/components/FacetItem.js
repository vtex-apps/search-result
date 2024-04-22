import React, { useContext, useState, useEffect, useMemo } from 'react'
import { Checkbox } from 'vtex.styleguide'
import { useCssHandles, applyModifiers } from 'vtex.css-handles'
import classNames from 'classnames'
import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'
import { usePixel } from 'vtex.pixel-manager'

import { pushFilterManipulationPixelEvent } from '../utils/filterManipulationPixelEvents'
import SettingsContext from './SettingsContext'
import useShouldDisableFacet from '../hooks/useShouldDisableFacet'

const CSS_HANDLES = ['filterItem', 'productCount', 'filterItemCustom', 'filterItemTitle']

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
function containsHTML(str) {
  const doc = new DOMParser().parseFromString(str, "text/html");
  return Array.from(doc.body.childNodes).some(node => node.nodeType === 1);
}

const FacetItem = ({
  navigateToFacet,
  facetTitle,
  facet,
  className,
  preventRouteChange,
  showTitle = false,
}) => {
  const { showFacetQuantity } = useContext(SettingsContext)

  const [selected, setSelected] = useState(facet.selected)
  const { push } = usePixel()
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

  const shouldDisable = useShouldDisableFacet(facet)
  

  const facetLabel = useMemo(() => {
    const hasHTML = containsHTML(facet.name);
    const secureName = hasHTML ? (<span className={handles.filterItemCustom} dangerouslySetInnerHTML={{ __html: facet.name }} />) : facet.name
    const labelElement =
      showFacetQuantity && !sampling ? (
        <>
          {secureName}{' '}
          <span
            data-testid={`facet-quantity-${facet.value}-${facet.quantity}`}
            className={handles.productCount}
          >
            ({facet.quantity})
          </span>
        </>
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
    facet,
    handles.productCount,
    handles.filterItemTitle,
    facetTitle,
    showTitle,
    showFacetQuantity,
    sampling,
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
