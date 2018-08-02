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
    /** Selected filters. */
    selecteds: PropTypes.arrayOf(PropTypes.shape({
      Name: PropTypes.string,
      Link: PropTypes.string,
      slug: PropTypes.string,
      type: PropTypes.string,
    })).isRequired,
    getLinkProps: PropTypes.func,
    intl: intlShape,
  }

  static defaultProps = {
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
        {({ Name: name, Link: link, type, slug }) => {
          const pagesArgs = this.props.getLinkProps({
            name,
            link,
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
                label={name}
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
