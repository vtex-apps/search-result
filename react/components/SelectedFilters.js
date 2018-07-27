import PropTypes from 'prop-types'
import { concat, keys, map, reduce } from 'ramda'
import React, { Component } from 'react'
import { intlShape, injectIntl } from 'react-intl'
import { Link } from 'render'
import { Checkbox } from 'vtex.styleguide'

import FiltersContainer from './FiltersContainer'

/**
 * Search Filter Component.
 */
class SelectedFilters extends Component {
  static propTypes = {
    /** If the filter is collapsed or not. */
    opened: PropTypes.bool,
    /** Selected filters. */
    selecteds: PropTypes.shape({
      Departments: PropTypes.arrayOf(PropTypes.string),
      Brands: PropTypes.arrayOf(PropTypes.string),
      SpecificationFilters: PropTypes.arrayOf(PropTypes.string),
      FullText: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
    getLinkProps: PropTypes.func,
    intl: intlShape,
  }

  static defaultProps = {
    opened: true,
    selecteds: [],
  }

  getSelectedFilters() {
    const selecteds = this.props.selecteds
    return reduce(
      (accumulator, filterName) =>
        concat(
          accumulator,
          map(term => {
            return { key: `${filterName}:${term}`, value: term }
          }, selecteds[filterName])
        ),
      [],
      keys(selecteds)
    )
  }

  render() {
    const { intl } = this.props
    const selectedFilters = this.getSelectedFilters()

    const title = intl.formatMessage({ id: 'search.selected-filters' })

    return (
      <FiltersContainer
        title={title}
        filters={selectedFilters}
      >
        {filter => {
          const pagesArgs = this.props.getLinkProps({
            opt: { Name: filter.value },
            isSelected: true,
          })

          return (
            <Link
              key={filter.key}
              className="w-100 flex clear-link"
              page={pagesArgs.page}
              params={pagesArgs.params}
              query={pagesArgs.queryString}>
              <Checkbox
                checked
                label={filter.value}
                name="default-checkbox-group"
                value=""
                onChange={evt => {
                  evt.preventDefault()
                }}
              />
            </Link>
          )
        }}
      </FiltersContainer>
    )
  }
}

export default injectIntl(SelectedFilters)
