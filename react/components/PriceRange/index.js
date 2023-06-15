import React, { useRef } from 'react'
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
import { useFilterNavigator } from '../FilterNavigatorContext'

const DEBOUNCE_TIME = 500 // ms

/** Price range slider component */
const PriceRange = ({
  title,
  facets,
  priceRange,
  priceRangeLayout,
  scrollToTop,
  showClearByFilter,
}) => {
  const { culture, setQuery, query: runtimeQuery } = useRuntime()
  const intl = useIntl()
  const navigateTimeoutId = useRef()
  const { map, query } = useFilterNavigator()

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

      // avoid page from reloading again after clear all button is clicked
      if (runtimeQuery?.priceRange || left !== minValue || right !== maxValue) {
        setQuery({
          priceRange: `${left} TO ${right}`,
          page: undefined,
          fuzzy: fuzzy || undefined,
          operator: operator || undefined,
          searchState: state,
          initialMap: runtimeQuery?.initialMap ?? map,
          initialQuery: runtimeQuery?.initialQuery ?? query,
        })
      }

      if (scrollToTop !== 'none') {
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

  const values = [minValue, maxValue]
  const currentValuesRegex = /^(.*) TO (.*)$/

  if (priceRange && currentValuesRegex.test(priceRange)) {
    const [, currentMin, currentMax] = priceRange.match(currentValuesRegex)

    values[0] = parseInt(currentMin, 10)
    values[1] = parseInt(currentMax, 10)
  }

  return (
    <FilterOptionTemplate
      id="priceRange"
      title={getFilterTitle(title, intl)}
      collapsable={false}
      handleClear={() => setQuery({ priceRange: undefined })}
      showClearByFilter={priceRange && showClearByFilter}
    >
      {priceRangeLayout === 'inputAndSlider' && (
        <PriceRangeInput
          defaultValues={values}
          onSubmit={newRange => handleChange(newRange)}
          max={maxValue}
          min={minValue}
        />
      )}
      <Slider
        min={minValue}
        max={maxValue}
        onChange={handleChange}
        formatValue={value => formatCurrency({ intl, culture, value })}
        values={values}
        defaultValues={values}
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
  /** Scroll behavior */
  scrollToTop: PropTypes.string,
  /** Defines whether the price range should be cleared or not */
  clearPriceRange: PropTypes.bool,
  /** Set the value of clearPriceRange prop */
  setClearPriceRange: PropTypes.func,
  /** Whether a clear button that clear all options in a specific filter should appear beside the filter's name (true) or not (false). */
  showClearByFilter: PropTypes.bool,
}

export default PriceRange
