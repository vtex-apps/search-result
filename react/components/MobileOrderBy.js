import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import classNames from 'classnames'

import CheckTick from '../images/CheckTick'
import Popup from './Popup'
import FooterButton from './FooterButton'

class MobileOrderBy extends Component {
  static propTypes = {
    orderBy: PropTypes.string,
    getLinkProps: PropTypes.func,
    options: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })),
    intl: intlShape,
  }

  static contextTypes = {
    navigate: PropTypes.func,
  }

  state = {
    selectedOption: this.props.orderBy,
  }

  handleSelect = option => e => {
    e.preventDefault()

    this.setState({
      selectedOption: option.value,
    })
  }

  render() {
    const { intl, options, getLinkProps } = this.props
    const { selectedOption } = this.state

    return (
      <Popup
        title="Ordernar"
        id="orderby"
        renderFooter={({ onClose }) => (
          <div className="flex justify-end pv3 ph6">
            <FooterButton
              onClick={e => {
                onClose(e)

                const linkProps = getLinkProps({ ordenation: selectedOption })

                this.context.navigate({
                  page: linkProps.page,
                  params: linkProps.params,
                  query: linkProps.queryString,
                  fallbackToWindowLocation: false,
                })
              }}
            >
              {intl.formatMessage({ id: 'ordenation.button' })}
            </FooterButton>
          </div>
        )}
      >
        <div className="vtex-orderby-popup">
          {options.map(opt => {
            const active = selectedOption === opt.value

            return (
              <div
                key={opt.label}
                className={classNames('vtex-orderby__item pointer pv3 ph7 bb b--light-gray', {
                  'vtex-orderby__item--active dark-gray normal': active,
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

export default injectIntl(MobileOrderBy)
