import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { injectIntl, intlShape } from 'react-intl'
import { Link } from 'render'

import FiltersContainer from './FiltersContainer'
import { facetOptionShape } from '../constants/propTypes'

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
    const title =
      this.props.title.startsWith('search.filter.title.')
        ? this.props.intl.formatMessage({ id: this.props.title })
        : this.props.title

    let filters = options || []

    if (oneSelectedCollapse) {
      const selecteds = filters.filter(option => option.selected)

      if (selecteds.length) {
        filters = selecteds
      }
    }

    return (
      <FiltersContainer
        title={title}
        filters={filters}
      >
        {opt => {
          const pagesArgs = getLinkProps({
            link: opt.Link,
            type,
            isSelected: opt.selected,
          })
          return (
            <Link
              key={opt.Name}
              className="clear-link w-100"
              page={pagesArgs.page}
              params={pagesArgs.params}
              query={pagesArgs.queryString}
            >
              <div className="flex items-center justify-between">
                <span
                  className="f6 fw3 bb"
                  style={{
                    borderColor: opt.selected
                      ? SELECTED_FILTER_COLOR
                      : 'transparent',
                    borderWidth: '1px',
                  }}
                >
                  {opt.Name}
                </span>
                <span className="f6 fw3">({opt.Quantity})</span>
              </div>
            </Link>
          )
        }}
      </FiltersContainer>
    )
  }
}

export default injectIntl(SearchFilter)
