import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { intlShape, injectIntl } from 'react-intl'

import SearchFilter from './SearchFilter'
import Arrow from '../images/Arrow'
import { facetOptionShape } from '../constants/propTypes'
import { getFilterTitle } from '../constants/SearchHelpers'

class AccordionFilterItem extends Component {
  static propTypes = {
    filter: facetOptionShape,
    show: PropTypes.bool,
    open: PropTypes.bool,
    onClick: PropTypes.func,
    intl: intlShape,
  }

  render() {
    const { filter: { title, options }, show, open, onClick, intl } = this.props

    if (!show) {
      return null
    }

    return (
      <div className="vtex-accordion-filter__item">
        <div className="vtex-accordion-filter__item-title pointer" onClick={onClick}>
          {getFilterTitle(title, intl)}

          <span className="vtex-accordion-filter__item-icon">
            <Arrow up={open} />
          </span>
        </div>

        {open && (
          <div className="vtex-accordion-filter__item-options">
            {options.map(opt => (
              <span
                key={opt.Name}
              >
                {opt.Name}
              </span>
            ))}
          </div>
        )}
      </div>
    )
  }
}

export default injectIntl(AccordionFilterItem)
