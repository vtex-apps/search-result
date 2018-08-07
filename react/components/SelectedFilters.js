import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { intlShape, injectIntl } from 'react-intl'
import { Link } from 'render'

import FilterOptionTemplate from './FilterOptionTemplate'
import Check from '../images/Check'

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
      <FilterOptionTemplate
        title={title}
        filters={this.props.selecteds}
        collapsable={false}
        selected
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
              query={pagesArgs.queryString}
            >
              <label className="w-100 flex items-center relative f7 fw3 mb2 pointer">
                <div className="absolute top-0 left-0 bottom-0">
                  <Check size={16} />
                </div>
                <input
                  className="mr2 o-0"
                  type="checkbox"
                  value=""
                  onChange={e => e.preventDefault()}
                  checked
                />
                {name}
              </label>
            </Link>
          )
        }}
      </FilterOptionTemplate>
    )
  }
}

export default injectIntl(SelectedFilters)
