import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useRuntime } from 'vtex.render-runtime'
import { useIntl } from 'react-intl'
import { Slider } from 'vtex.styleguide'
import { formatCurrency } from 'vtex.format-currency'
import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'
import { usePixel } from 'vtex.pixel-manager'

import { pushFilterManipulationPixelEvent } from '../../utils/filterManipulationPixelEvents'
import { facetOptionShape } from '../../constants/propTypes'
import { getFilterTitle } from '../../constants/SearchHelpers'
import FilterOptionTemplate from '../FilterOptionTemplate'
import useSearchState from '../../hooks/useSearchState'
import PriceRangeInput from './PriceRangeInput'

const DEBOUNCE_TIME = 500 // ms

/** Price range slider component */
const PriceRange = ({ title, facets, priceRange, priceRangeLayout, scrollToTop }) => {
  const [range, setRange] = useState()
  const { culture, setQuery } = useRuntime()
  const intl = useIntl()
  const navigateTimeoutId = useRef()

  const { push } = usePixel()
  const { searchQuery } = useSearchPage()

  const { fuzzy, operator, searchState } = useSearchState()

  const handleChange = ([left, right]) => {
    if (navigateTimeoutId.current) {
      clearTimeout(navigateTimeoutId.current)
    }

    pushFilterManipulationPixelEvent({
      name: 'PriceRange',
      value: `[${left.toString()}-${right.toString()}]`,
      products: searchQuery?.products ?? [],
      push,
    })

    navigateTimeoutId.current = setTimeout(() => {
      const state =
        typeof sessionStorage !== 'undefined'
          ? sessionStorage.getItem('searchState') ?? searchState
          : searchState ?? undefined

      setQuery({
        priceRange: `${left} TO ${right}`,
        page: undefined,
        fuzzy: fuzzy || undefined,
        operator: operator || undefined,
        searchState: state,
      })

      setRange([left, right])
      
      if(scrollToTop !== 'none'){
        window.scroll({ top: 0, left: 0, behavior: scrollToTop })
      }
      
    }, DEBOUNCE_TIME)
  }

  const slugRegex = /^de-(.*)-a-(.*)$/
  const availableOptions = facets.filter(({ slug }) => slugRegex.test(slug))

  if (!availableOptions.length) {
    return null
  }

  let minValue = Number.MAX_VALUE
  let maxValue = Number.MIN_VALUE

  availableOptions.forEach(({ slug }) => {
    const [, minSlug, maxSlug] = slug.match(slugRegex)

    const min = parseInt(minSlug, 10)
    const max = parseInt(Math.ceil(maxSlug), 10)

    if (min < minValue) {
      minValue = min
    }

    if (max > maxValue) {
      maxValue = max
    }
  })

  const defaultValues = [minValue, maxValue]
  const currentValuesRegex = /^(.*) TO (.*)$/

  if (priceRange && currentValuesRegex.test(priceRange)) {
    const [, currentMin, currentMax] = priceRange.match(currentValuesRegex)

    defaultValues[0] = parseInt(currentMin, 10)
    defaultValues[1] = parseInt(currentMax, 10)
  }

  return (
    <FilterOptionTemplate
      id="priceRange"
      title={getFilterTitle(title, intl)}
      collapsable={false}
    >
      {priceRangeLayout === 'inputAndSlider' && (
        <PriceRangeInput
          defaultValues={defaultValues}
          onSubmit={(newRange) => setRange(newRange)}
          max={maxValue}
          min={minValue}
        />
      )}
      <Slider
        // It is impossible to change the slider value programmatically, so I need to reset the whole component
        min={minValue}
        max={maxValue}
        onChange={handleChange}
        defaultValues={defaultValues}
        formatValue={(value) => formatCurrency({ intl, culture, value })}
        values={range}
        range
      />
    </FilterOptionTemplate>
  )
}

PriceRange.propTypes = {
  /** Filter title */
  title: PropTypes.string.isRequired,
  /** Available price ranges */
  facets: PropTypes.arrayOf(facetOptionShape).isRequired,
  /** Current price range filter query parameter */
  priceRange: PropTypes.string,
  /** Price range layout (default or inputAndSlider) */
  priceRangeLayout: PropTypes.string,
}

export default PriceRange
