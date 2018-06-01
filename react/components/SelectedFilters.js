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
    opened: PropTypes.bool,
    selecteds: PropTypes.object.isRequired,
    disabled: PropTypes.bool,
    query: PropTypes.string,
    map: PropTypes.string,
    orderBy: PropTypes.string,
  }

  static defaultProps = {
    opened: true,
    disabled: false,
    selecteds: [],
  }

  constructor(props) {
    super(props)
    this.state = {
      opened: props.opened,
    }
  }

  getSelectedFilters() {
    const selectedsFilters = []
    const keys = Object.keys(this.props.selecteds)

    keys.map(key => {
      this.props.selecteds[key].map(val => {
        selectedsFilters.push({
          label: `${key}: ${val}`,
          value: val,
        })
      })
    })
    return selectedsFilters
  }

  render() {
    const { opened } = this.state
    const { query, map, orderBy, disabled } = this.props
    const selectedFilters = this.getSelectedFilters()

    return (
      <div className={`${VTEXClasses.SEARCH_FILTER_MAIN_CLASS} pa4 bb b--light-gray`}>

        <div className="pointer mb5" onClick={() => { this.setState({ opened: !opened }) }}>
          <div className="f4">
            Selected Filters
            <span className={`${VTEXClasses.SEARCH_FILTER_HEADER_ICON} fr`}>
              <img src={opened ? ArrowUp : ArrowDown} width={20} />
            </span>
          </div>
        </div>

        <Collapse isOpened={opened} style={{ overflowY: 'auto', maxHeight: '200px' }}>
          <div className="w-90 dib pa3">
            {selectedFilters.map(selected => {
              const pagesArgs = getPagesArgs({ Name: selected.value }, query, map, orderBy, true)
              return !disabled
                ? <Link
                  key={selected.value}
                  className="clear-link"
                  page={pagesArgs.page}
                  params={pagesArgs.params}
                  query={pagesArgs.queryString}>
                  <div key={selected.label} className="w-100">
                    <div className="bg-silver pa4 br3 mb2 mr2 fl">
                      {selected.label}
                    </div>
                  </div>
                </Link>
                : <div key={selected.label} className="w-100">
                  <div className="bg-silver pa4 br3 mb2 mr2 fl">
                    {selected.label}
                  </div>
                </div>
            })}
          </div>
        </Collapse>
      </div>
    )
  }
}
