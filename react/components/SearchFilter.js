import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { injectIntl, intlShape } from 'react-intl'
import { Link } from 'render'

import FilterOptionTemplate from './FilterOptionTemplate'
import { facetOptionShape } from '../constants/propTypes'
import { getFilterTitle, formatFacetToLinkPropsParam } from '../constants/SearchHelpers'

const SELECTED_FILTER_COLOR = '#368DF7'

/**
 * Search Filter Component.
 */
class SearchFilter extends Component {
  static propTypes = {
    /** SearchFilter's title. */
    title: PropTypes.string.isRequired,
    /** If filter is collapsable or not. */
    opened: PropTypes.bool,
    /** SearchFilter's options. */
    options: PropTypes.arrayOf(facetOptionShape),
    /** SearchFilter's type. */
    type: PropTypes.string,
    /** If the SearchFilter must collapse when just one is selected. */
    oneSelectedCollapse: PropTypes.bool,
    /** Returns the link props. */
    getLinkProps: PropTypes.func,
    /** Intl instance. */
    intl: intlShape.isRequired,
  }

  static defaultProps = {
    title: 'Default Title',
    opened: true,
    options: [],
  }

  render() {
    const { type, options, getLinkProps, oneSelectedCollapse } = this.props
    const title = getFilterTitle(this.props.title, this.props.intl)

    let filters = options || []

    if (oneSelectedCollapse) {
      const selecteds = filters.filter(option => option.selected)

      if (selecteds.length) {
        filters = selecteds
      }
    }

    return (
      <FilterOptionTemplate
        title={title}
        filters={filters}
      >
        {opt => {
          const pagesArgs = getLinkProps(formatFacetToLinkPropsParam(type, opt, oneSelectedCollapse))

          return (
            <Link
              key={opt.Name}
              className="clear-link w-100"
              page={pagesArgs.page}
              params={pagesArgs.params}
              query={pagesArgs.queryString}
              scrollOptions={{ elementId: 'search-result-anchor' }}
            >
              <span
                className="f6 fw3 bb db"
                style={{
                  borderColor: opt.selected
                    ? SELECTED_FILTER_COLOR
                    : 'transparent',
                  borderWidth: '1px',
                }}
              >
                {opt.Name}
              </span>
            </Link>
          )
        }}
      </FilterOptionTemplate>
    )
  }
}

export default injectIntl(SearchFilter)
