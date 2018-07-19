import PropTypes from 'prop-types'
import { contains } from 'ramda'
import React, { Component } from 'react'
import { Collapse } from 'react-collapse'
import { injectIntl, intlShape } from 'react-intl'
import { Link } from 'render'

import VTEXClasses from '../constants/CSSClasses'
import { facetOptionShape } from '../constants/propTypes'
import ArrowDown from '../images/arrow-down.svg'
import ArrowUp from '../images/arrow-up.svg'

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

  constructor(props) {
    super(props)
    this.state = {
      opened: props.opened,
    }
  }

  isSelected(optName) {
    return contains(optName.toUpperCase(), this.props.selecteds)
  }

  renderOptions() {
    const { type, options, getLinkProps, oneSelectedCollapse } = this.props
    if (options) {
      let opts = options
      if (oneSelectedCollapse) {
        const selecteds = opts.filter(option => {
          return this.isSelected(option.Name)
        })
        if (selecteds.length) {
          opts = selecteds
        }
      }
      return opts.map(opt => {
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
            query={pagesArgs.queryString}>
            <div className="w-90 flex items-center justify-between pa3">
              <div className="flex items-center justify-center">
                <span
                  className="bb"
                  style={{
                    borderColor: `${
                      this.isSelected(opt.Name)
                        ? SELECTED_FILTER_COLOR
                        : 'transparent'
                    }`,
                    borderWidth: '3px',
                  }}>
                  {opt.Name}
                </span>
              </div>
              <span className="flex items-center f5">( {opt.Quantity} )</span>
            </div>
          </Link>
        )
      })
    }
  }

  render() {
    const { opened } = this.state
    const title =
      this.props.title === CATEGORIES_FILTER_TITLE
        ? this.props.intl.formatMessage({ id: this.props.title })
        : this.props.title
    return (
      <div
        className={`${
          VTEXClasses.SEARCH_FILTER_MAIN_CLASS
        } ph4 pt4 pb2 bb b--light-gray`}>
        <div
          className="pointer mb4"
          onClick={() => {
            this.setState({ opened: !opened })
          }}>
          <div>
            <div className="f4">
              {title}
              <span className={`${VTEXClasses.SEARCH_FILTER_HEADER_ICON} fr`}>
                <img src={opened ? ArrowUp : ArrowDown} width={20} />
              </span>
            </div>
          </div>
        </div>
        <div style={{ overflowY: 'auto', maxHeight: '200px' }}>
          <Collapse isOpened={opened}>{this.renderOptions()}</Collapse>
        </div>
      </div>
    )
  }
}

export default injectIntl(SearchFilter)
