import React, { Component } from 'react'
import { withRuntimeContext } from 'render'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import classNames from 'classnames'

import CheckTick from '../images/CheckTick'
import Popup from './Popup'

class SelectionListOrderBy extends Component {
  static propTypes = {
    orderBy: PropTypes.string,
    getLinkProps: PropTypes.func,
    options: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })),
    intl: intlShape,
    runtime: PropTypes.shape({
      navigate: PropTypes.func,
    }),
  }

  handleSelect = option => e => {
    e.preventDefault()

    const { getLinkProps, runtime: { navigate } } = this.props

    const linkProps = getLinkProps({ ordenation: option.value })

    navigate({
      page: linkProps.page,
      query: linkProps.queryString,
      params: linkProps.params,
    })
  }

  render() {
    const { intl, options, orderBy } = this.props

    return (
      <Popup
        title={intl.formatMessage({ id: 'search-result.orderby.title' })}
        id="orderby"
      >
        <div className="vtex-orderby-popup">
          {options.map(opt => {
            const active = orderBy === opt.value

            return (
              <div
                key={opt.label}
                className={classNames('vtex-orderby__item pointer pv3 ph7 bb b--muted-4', {
                  'vtex-orderby__item--active t-body c-on-base': active,
                  'fw3': !active,
                })}
                onClick={this.handleSelect(opt)}
              >
                {opt.label}

                {active && (
                  <span className="vtex-orderby__item-icon fr">
                    <CheckTick />
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </Popup>
    )
  }
}

export default injectIntl(withRuntimeContext(SelectionListOrderBy))
