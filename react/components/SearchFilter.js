import PropTypes from 'prop-types'
import { contains } from 'ramda'
import React, { Component } from 'react'
import { injectIntl, intlShape } from 'react-intl'
import { Link } from 'render'

import FiltersContainer from './FiltersContainer'
import { facetOptionShape } from '../constants/propTypes'

const CATEGORIES_FILTER_TITLE = 'search.filter.title.categories'
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
    /** SearchFilter's options selecteds. */
    selecteds: PropTypes.arrayOf(PropTypes.string).isRequired,
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
    selecteds: [],
  }

  isSelected(optName) {
    return contains(optName.toUpperCase(), this.props.selecteds)
  }

  renderOptions() {
  }

  render() {
    const { type, options, getLinkProps, oneSelectedCollapse } = this.props
    const title =
      this.props.title === CATEGORIES_FILTER_TITLE
        ? this.props.intl.formatMessage({ id: this.props.title })
        : this.props.title

    let filters = options || []

    if (oneSelectedCollapse) {
      const selecteds = filters.filter(option => this.isSelected(option.Name))

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
            opt,
            type,
            isSelected: this.isSelected(opt.Name),
          })
          return (
            <Link
              key={opt.Name}
              className="clear-link"
              page={pagesArgs.page}
              params={pagesArgs.params}
              query={pagesArgs.queryString}
            >
              <div className="w-90 flex items-center justify-between pa3">
                <div className="flex items-center justify-center">
                  <span
                    className="bb"
                    style={{
                      borderColor:
                      this.isSelected(opt.Name)
                        ? SELECTED_FILTER_COLOR
                        : 'transparent',
                      borderWidth: '3px',
                    }}
                  >
                    {opt.Name}
                  </span>
                </div>
                <span className="flex items-center f5">( {opt.Quantity} )</span>
              </div>
            </Link>
          )
        }}
      </FiltersContainer>
    )
  }
}

export default injectIntl(SearchFilter)
