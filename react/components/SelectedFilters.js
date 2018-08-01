import PropTypes from 'prop-types'
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
    selecteds: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      slug: PropTypes.string,
      link: PropTypes.string,
      type: PropTypes.string,
    })).isRequired,
    getLinkProps: PropTypes.func,
    intl: intlShape,
  }

  static defaultProps = {
    opened: true,
    selecteds: [],
  }

  render() {
    const { intl } = this.props
    const title = intl.formatMessage({ id: 'search.selected-filters' })
    return (
      <FiltersContainer
        title={title}
        filters={this.props.selecteds}
      >
        {({ Name, Link: link, type, slug }) => {
          const pagesArgs = this.props.getLinkProps({
            opt: { Name, Link: link },
            type,
            isSelected: true,
          })
          return (
            <Link
              key={slug}
              className="w-100 flex clear-link"
              page={pagesArgs.page}
              params={pagesArgs.params}
              query={pagesArgs.queryString}>
              <Checkbox
                checked
                label={Name}
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
