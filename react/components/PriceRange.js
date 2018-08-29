import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'

import { facetOptionShape } from '../constants/propTypes'
import { getFilterTitle } from '../constants/SearchHelpers'
import FilterOptionTemplate from './FilterOptionTemplate'
import Range from './Range'

/** Price range slider component */
class PriceRange extends Component {
  static propTypes = {
    /** Filter title */
    title: PropTypes.string.isRequired,
    /** Available price ranges */
    options: PropTypes.arrayOf(facetOptionShape).isRequired,
    /** Intl instance */
    intl: intlShape,
  }

  handleChange = ({ left, right }) => {
    console.log('min', left, 'max', right)
  }

  render() {
    const { options, intl } = this.props
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

    return (
      <FilterOptionTemplate title={title} collapsable={false}>
        <Range
          min={minValue}
          max={maxValue}
          onChange={this.handleChange}
        />
      </FilterOptionTemplate>
    )
  }
}

export default injectIntl(PriceRange)
