import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Collapse } from 'react-collapse'
import { contains } from 'ramda'

import ArrowDown from '../images/arrow-down.svg'
import ArrowUp from '../images/arrow-up.svg'
import VTEXClasses from '../constants/CSSClasses'
import { facetOptionShape } from '../constants/propTypes'

import { Link } from 'render'
import { intlShape, injectIntl } from 'react-intl'

const CATEGORIES_FILTER_TITLE = 'search.filter.title.categories'

/**
 * Search Filter Component.
 */
class SearchFilter extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    opened: PropTypes.bool,
    options: PropTypes.arrayOf(facetOptionShape),
    selecteds: PropTypes.arrayOf(PropTypes.string).isRequired,
    type: PropTypes.string,
    disabled: PropTypes.bool,
    getLinkProps: PropTypes.func,
    intl: intlShape.isRequired,
  }

  static defaultProps = {
    title: 'Default Title',
    disabled: false,
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

  isDisabled(opt) {
    return this.isSelected(opt.Name) && this.props.disabled
  }

  render() {
    const { opened } = this.state
    let { type, options, getLinkProps, title } = this.props
    if (title === CATEGORIES_FILTER_TITLE) {
      title = this.props.intl.formatMessage({ id: title })
    }
    return (
      <div className={`${VTEXClasses.SEARCH_FILTER_MAIN_CLASS} ph4 pt4 pb2 bb b--light-gray`}>

        <div className="pointer mb4" onClick={() => { this.setState({ opened: !opened }) }}>
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
          <Collapse isOpened={opened}>
            {options && options.map(opt => {
              const pagesArgs = getLinkProps(opt, null, this.isSelected(opt.Name), type)
              return (
                <Link
                  key={opt.Name}
                  className="clear-link"
                  page={pagesArgs.page}
                  params={pagesArgs.params}
                  query={pagesArgs.queryString}>

                  <div className="w-90 flex items-center justify-between pa3">
                    <div className="flex items-center justify-center">
                      <span className="bb" style={{ borderColor: `${this.isSelected(opt.Name) ? '#368DF7' : 'transparent'}`, borderWidth: '3px' }}>
                        {opt.Name}
                      </span>
                    </div>
                    <span className="flex items-center f5">( {opt.Quantity} )</span>
                  </div>
                </Link>
              )
            })}
          </Collapse>
        </div>
      </div>
    )
  }
}

export default injectIntl(SearchFilter)
