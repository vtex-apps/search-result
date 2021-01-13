import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import { useRuntime } from 'vtex.render-runtime'
import { useIntl } from 'react-intl'
import { Slider } from 'vtex.styleguide'
import { formatCurrency } from 'vtex.format-currency'

import { facetOptionShape } from '../constants/propTypes'
import { getFilterTitle } from '../constants/SearchHelpers'
import FilterOptionTemplate from './FilterOptionTemplate'
import useSearchState from '../hooks/useSearchState'

const DEBOUNCE_TIME = 500 // ms

/** Price range slider component */
const PriceRange = ({ title, facets, priceRange }) => {
  const { culture, setQuery } = useRuntime()
  const intl = useIntl()

  const navigateTimeoutId = useRef()

  const { fuzzy, operator, searchState } = useSearchState()

  const handleChange = ([left, right]) => {
    if (navigateTimeoutId.current) {
      clearTimeout(navigateTimeoutId.current)
    }

    navigateTimeoutId.current = setTimeout(() => {
      setQuery({
        priceRange: `${left} TO ${right}`,
        page: undefined,
        fuzzy: fuzzy || undefined,
        operator: operator || undefined,
        searchState: searchState || undefined,
      })
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
      <Slider
        min={minValue}
        max={maxValue}
        onChange={handleChange}
        defaultValues={defaultValues}
        formatValue={(value) => formatCurrency({ intl, culture, value })}
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
}

export default PriceRange
