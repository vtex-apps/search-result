import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Collapse } from 'react-collapse'

import ArrowDown from '../images/arrow-down.svg'
import ArrowUp from '../images/arrow-up.svg'
import VTEXClasses from '../constants/CSSClasses'
import { getPagesArgs } from '../constants/SearchHelpers'

import { Link } from 'render'

/**
 * Search Filter Component.
 */
export default class SearchFilter extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    opened: PropTypes.bool,
    options: PropTypes.arrayOf(PropTypes.shape({
      Quantity: PropTypes.number.isRequired,
      Link: PropTypes.string.isRequired,
      Name: PropTypes.string.isRequired,
    })),
    selecteds: PropTypes.array.isRequired,
    type: PropTypes.string,
    disabled: PropTypes.bool,
    query: PropTypes.string,
    map: PropTypes.string,
    orderBy: PropTypes.string,
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
    return this.props.selecteds.indexOf(optName.toUpperCase()) !== -1
  }

  isDisabled(opt) {
    return this.isSelected(opt.Name) && this.props.disabled
  }

  render() {
    const { opened } = this.state
    const { query, map, orderBy, type, options } = this.props
    return (
      <div className={`${VTEXClasses.SEARCH_FILTER_MAIN_CLASS} pa4 bb b--light-gray`}>

        <div className="pointer mb5" onClick={() => { this.setState({ opened: !opened }) }}>
          <div>
            <div className="f4">
              {this.props.title}
              <span className={`${VTEXClasses.SEARCH_FILTER_HEADER_ICON} fr`}>
                <img src={opened ? ArrowUp : ArrowDown} width={20} />
              </span>
            </div>
          </div>
        </div>

        <Collapse isOpened={opened} style={{ overflowY: 'auto', maxHeight: '200px' }}>
          {options && options.map(opt => {
            const pagesArgs = getPagesArgs(opt, query, map, orderBy, this.isSelected(opt.Name), type)
            return (
              <Link
                key={opt.Name}
                className="clear-link"
                page={pagesArgs.page}
                params={pagesArgs.params}
                query={pagesArgs.queryString}>

                <div className="w-90 flex items-center justify-between pa3">
                  <div className="flex items-center justify-center">
                    <input className={`${!this.isDisabled(opt) ? 'pointer' : ''} mr4`} type="checkbox" disabled={this.isDisabled(opt)} onChange={(evt) => {
                      evt.preventDefault()
                    }} checked={this.isSelected(opt.Name)} />
                    <span>
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
    )
  }
}
