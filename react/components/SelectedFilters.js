import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { intlShape, injectIntl } from 'react-intl'

import { Link } from 'vtex.render-runtime'

import FilterOptionTemplate from './FilterOptionTemplate'
import {
  formatFacetToLinkPropsParam,
  HEADER_SCROLL_OFFSET,
} from '../constants/SearchHelpers'

import searchResult from '../searchResult.css'

/**
 * Search Filter Component.
 */
class SelectedFilters extends Component {
  static propTypes = {
    /** Selected filters. */
    filters: PropTypes.arrayOf(
      PropTypes.shape({
        Name: PropTypes.string,
        Link: PropTypes.string,
        slug: PropTypes.string,
        type: PropTypes.string,
      })
    ).isRequired,
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
        filters={this.props.filters}
        collapsable={false}
        selected
      >
        {opt => {
          const pagesArgs = this.props.getLinkProps(
            formatFacetToLinkPropsParam(opt.type, opt)
          )

          return (
            <Link
              key={opt.slug}
              className="w-100 flex clear-link"
              page={pagesArgs.page}
              params={pagesArgs.params}
              query={pagesArgs.queryString}
              scrollOptions={{
                baseElementId: 'search-result-anchor',
                top: -HEADER_SCROLL_OFFSET,
              }}
            >
              <label className="w-100 flex items-center relative t-body fw3 mb2 pointer">
                <input
                  className={`${searchResult.selectedFilterCheckbox} mr2 o-0`}
                  type="checkbox"
                  value=""
                  onChange={e => e.preventDefault()}
                  checked
                />
                {opt.Name}
              </label>
            </Link>
          )
        }}
      </FilterOptionTemplate>
    )
  }
}

export default injectIntl(SelectedFilters)
