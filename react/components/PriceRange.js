import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRuntimeContext } from 'render'
import { injectIntl, intlShape } from 'react-intl'
import { Button } from 'vtex.styleguide'

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
    intl: intlShape.isRequired,
    getLinkProps: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
    runtime: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
    }).isRequired,
  }

  state = {
    left: 0,
    right: 0,
  }

  handleChange = ({ left, right }) => {
    this.setState({
      left,
      right,
    })
  }

  handleFilter = e => {
    e.preventDefault()

    const { type, getLinkProps, runtime: { navigate } } = this.props

    const linkProps = getLinkProps({
      slug: `${this.state.left} TO ${this.state.right}`,
      type,
    })

    navigate({
      page: linkProps.page,
      params: linkProps.params,
      query: linkProps.queryString,
    })
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

      initialValues.left = currentMin
      initialValues.right = currentMax
    }

    return (
      <FilterOptionTemplate title={title} collapsable={false}>
        <div className="flex flex-column">
          <Range
            min={minValue}
            max={maxValue}
            onChange={this.handleChange}
            initialValues={initialValues}
          />

          <div className="self-end">
            <Button variation="primary" size="small" onClick={this.handleFilter}>
              Filtrar
            </Button>
          </div>
        </div>
      </FilterOptionTemplate>
    )
  }
}

export default withRuntimeContext(injectIntl(PriceRange))
