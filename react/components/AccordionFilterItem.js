import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { intlShape, injectIntl } from 'react-intl'
import classNames from 'classnames'

import Arrow from '../images/Arrow'
import CheckTick from '../images/CheckTick'
import { facetOptionShape } from '../constants/propTypes'
import { getFilterTitle } from '../constants/SearchHelpers'

class AccordionFilterItem extends Component {
  static propTypes = {
    filter: facetOptionShape,
    show: PropTypes.bool,
    open: PropTypes.bool,
    onOpen: PropTypes.func,
    onSelectOption: PropTypes.func,
    isOptionActive: PropTypes.func,
    intl: intlShape,
  }

  render() {
    const {
      filter: { title, options },
      show,
      open,
      onOpen,
      onSelectOption,
      isOptionActive,
      intl,
    } = this.props

    return (
      <Fragment>
        <div
          className={classNames('vtex-accordion-filter__item fw3 pv3 ph7 pointer', {
            'vtex-accordion-filter__item--active': open,
            'vtex-accordion-filter__item--hidden dn': !show,
          })}
          onClick={onOpen}
        >
          <div
            className={classNames('vtex-accordion-filter__item-title', {
              'normal': open,
            })}
          >
            {getFilterTitle(title, intl)}

            <span className="vtex-accordion-filter__item-icon fr">
              <Arrow up={open} />
            </span>
          </div>
        </div>
        {open && (
          <div className="vtex-accordion-filter__item-options">
            {options.map(opt => {
              const isActive = isOptionActive(opt)

              const optionClassName = classNames('vtex-accordion-filter__item-opt pv3 ph7 pointer', {
                'vtex-accordion-filter__item-opt--active rebel-pink normal': isActive,
                'fw3': !isActive,
              })

              return (
                <div
                  key={opt.Name}
                  className={optionClassName}
                  onClick={e => onSelectOption(e, opt)}
                >
                  {opt.Name}

                  {isActive && (
                    <span className="vtex-accordion-filter__check-icon fr">
                      <CheckTick />
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </Fragment>
    )
  }
}

export default injectIntl(AccordionFilterItem)
