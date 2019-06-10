import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import { useRuntime } from 'vtex.render-runtime'
import { injectIntl, intlShape } from 'react-intl'
import { Slider } from 'vtex.styleguide'

import { facetOptionShape } from '../../../constants/propTypes'
import {
  getFilterTitle,
  HEADER_SCROLL_OFFSET,
} from '../../../constants/SearchHelpers'
import FilterOptionTemplate from './FilterOptionTemplate'

const DEBOUNCE_TIME = 500 // ms

/** Price range slider component */
const PriceRange = ({ title, facets, intl, priceRange }) => {
  const {
    navigate,
    culture: { currency },
  } = useRuntime()

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, minSlug, maxSlug] = slug.match(slugRegex)

    const min = parseInt(minSlug)
    const max = parseInt(maxSlug)

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, currentMin, currentMax] = priceRange.match(currentValuesRegex)

    defaultValues[0] = parseInt(currentMin)
    defaultValues[1] = parseInt(currentMax)
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
        formatValue={value => intl.formatNumber(value, currencyOptions)}
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
  /** Intl instance */
  intl: intlShape.isRequired,
  /** Current price range filter query parameter*/
  priceRange: PropTypes.string,
}

export default injectIntl(PriceRange)
