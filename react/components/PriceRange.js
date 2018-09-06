import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRuntimeContext } from 'render'
import { injectIntl, intlShape } from 'react-intl'

import { facetOptionShape } from '../constants/propTypes'
import { getFilterTitle } from '../constants/SearchHelpers'
import FilterOptionTemplate from './FilterOptionTemplate'
import RangeSlider from './RangeSlider'

const DEBOUNCE_TIME = 500 // ms

/** Price range slider component */
class PriceRange extends Component {
  static propTypes = {
    /** Filter title */
    title: PropTypes.string.isRequired,
    /** Available price ranges */
    options: PropTypes.arrayOf(facetOptionShape).isRequired,
    /** Intl instance */
    intl: intlShape.isRequired,
    /** Get the props to pass to render's Link */
    getLinkProps: PropTypes.func.isRequired,
    /** Price range facet type */
    type: PropTypes.string.isRequired,
    /** Runtime context */
    runtime: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
      culture: PropTypes.shape({
        currency: PropTypes.string,
      }),
    }).isRequired,
    /** Current price range filter query parameter*/
    priceRange: PropTypes.string,
  }

  get currencyOptions() {
    return {
      style: 'currency',
      currency: this.props.runtime.culture.currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  }

  handleChange = ({ left, right }) => {
    if (this.navigateTimeoutId) {
      clearTimeout(this.navigateTimeoutId)
    }

    this.navigateTimeoutId = setTimeout(() => {
      const { type, getLinkProps, runtime: { navigate } } = this.props

      const linkProps = getLinkProps({
        slug: `${left} TO ${right}`,
        type,
      })

      navigate({
        page: linkProps.page,
        params: linkProps.params,
        query: linkProps.queryString,
      })
    }, DEBOUNCE_TIME)
  }

  render() {
    const { options, intl, priceRange } = this.props
    const title = getFilterTitle(this.props.title, intl)

    const slugRegex = /^de-(.*)-a-(.*)$/
    const availableOptions = options.filter(({ Slug }) => slugRegex.test(Slug))

    if (!availableOptions.length) {
      return null
    }

    let minValue = Number.MAX_VALUE
    let maxValue = Number.MIN_VALUE

    availableOptions.forEach(({ Slug }) => {
      const [_, minSlug, maxSlug] = Slug.match(slugRegex) // eslint-disable-line no-unused-vars

      const min = parseInt(minSlug)
      const max = parseInt(maxSlug)

      if (min < minValue) {
        minValue = min
      }
      if (max > maxValue) {
        maxValue = max
      }
    })

    const initialValues = { left: minValue, right: maxValue }
    const currentValuesRegex = /^(.*) TO (.*)$/

    if (priceRange && currentValuesRegex.test(priceRange)) {
      const [_, currentMin, currentMax] = priceRange.match(currentValuesRegex) // eslint-disable-line no-unused-vars

      initialValues.left = parseInt(currentMin)
      initialValues.right = parseInt(currentMax)
    }

    return (
      <FilterOptionTemplate title={title} collapsable={false}>
        <RangeSlider
          min={minValue}
          max={maxValue}
          onChange={this.handleChange}
          initialValues={initialValues}
          formatValue={value => intl.formatNumber(value, this.currencyOptions)}
        />
      </FilterOptionTemplate>
    )
  }
}

export default withRuntimeContext(injectIntl(PriceRange))
