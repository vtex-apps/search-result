import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import { useRuntime } from 'vtex.render-runtime'
import { useIntl } from 'react-intl'
import { Slider } from 'vtex.styleguide'

import { facetOptionShape } from '../../../constants/propTypes'
import {
  getFilterTitle,
  HEADER_SCROLL_OFFSET,
} from '../../../constants/SearchHelpers'
import FilterOptionTemplate from './FilterOptionTemplate'

const DEBOUNCE_TIME = 500 // ms

/** Price range slider component */
const PriceRange = ({ title, facets, priceRange }) => {
  const {
    navigate,
    culture: { currency },
  } = useRuntime()

  const intl = useIntl()

  const navigateTimeoutId = useRef()

  const currencyOptions = {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }

  const handleChange = ([left, right]) => {
    if (navigateTimeoutId.current) {
      clearTimeout(navigateTimeoutId.current)
    }

    navigateTimeoutId.current = setTimeout(() => {
      const queryParams = new URLSearchParams(window.location.search)

      queryParams.set('priceRange', `${left} TO ${right}`)

      navigate({
        to: window.location.pathname,
        query: queryParams.toString(),
        scrollOptions: {
          baseElementId: 'search-result-anchor',
          top: -HEADER_SCROLL_OFFSET,
        },
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
    const max = parseInt(maxSlug, 10)

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
      title={getFilterTitle(title, intl)}
      collapsable={false}
    >
      <Slider
        min={minValue}
        max={maxValue}
        onChange={handleChange}
        defaultValues={defaultValues}
        formatValue={(value) => intl.formatNumber(value, currencyOptions)}
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
