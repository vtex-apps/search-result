import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Collapse } from 'react-collapse'
import QueryString from 'query-string'

import ArrowDown from '../images/arrow-down.svg'
import ArrowUp from '../images/arrow-up.svg'
import VTEXClasses from '../constants/CSSClasses'
import { getFacetsFromURL } from '../constants/graphqlHelpers'

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
    query: PropTypes.string,
    map: PropTypes.string,
    selecteds: PropTypes.array.isRequired,
    type: PropTypes.string,
    onSelected: PropTypes.func,
    disabled: PropTypes.bool,
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

  getUnselectedLink(optName) {
    const { query, map } = this.props
    const pathValues = query.split('/')
    const mapValues = map.split(',')
    for (let i = 0; i < pathValues.length; i++) {
      if (pathValues[i].toUpperCase() === optName.toUpperCase()) {
        pathValues.splice(i, 1)
        mapValues.splice(i, 1)
        return `${pathValues.join('/')}?map=${mapValues.join(',')}`
      }
    }
  }

  getLink(link) {
    const { url: pathName, query: queryParams } = QueryString.parseUrl(link)
    return getFacetsFromURL(pathName, queryParams, true, this.props.type === 'Brands')
  }

  isDisabled(opt) {
    return this.isSelected(opt.Name) && this.props.disabled
  }

  render() {
    const { opened } = this.state
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
          {this.props.options && this.props.options.map(opt => {
            return (
              <div key={opt.Name} className={`flex ${!this.isDisabled(opt) ? 'pointer dim' : ''}`} onClick={() => {
                if (this.isSelected(opt.Name)) {
                  if (!this.props.disabled) {
                    this.props.onSelected(this.getUnselectedLink(opt.Name))
                  }
                } else {
                  this.props.onSelected(this.getLink(opt.Link))
                }
              }}>
                <div className="w-80 flex items-center pa3">
                  <input className="mr4" type="checkbox" disabled={this.isDisabled(opt)} onChange={(evt) => {
                    evt.preventDefault()
                  }} checked={this.isSelected(opt.Name)} />
                  <span>
                    {opt.Name}
                  </span>
                </div>
                <span className="w-20 flex items-center justify-start f5">( {opt.Quantity} )</span>
              </div>
            )
          })}
        </Collapse>
      </div>
    )
  }
}
