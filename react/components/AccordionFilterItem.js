import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { intlShape, injectIntl } from 'react-intl'
import classNames from 'classnames'
import { Checkbox } from 'vtex.styleguide'

import Arrow from '../images/Arrow'
import { facetOptionShape } from '../constants/propTypes'
import { getFilterTitle } from '../constants/SearchHelpers'

const AccordionFilterItem = ({
  title,
  options,
  show,
  open,
  onOpen,
  intl,
  onFilterCheck,
  isOptionSelected,
}) => (
  <Fragment>
    {!open && (
      <div className="pl7">
        <div
          className={classNames(
            'vtex-accordion-filter__item vtex-filter-accordion__item-box t-body pr5 pv3 pointer bb b--muted-5',
            {
              'vtex-accordion-filter__item--active': open,
              'vtex-accordion-filter__item--hidden dn': !show,
            }
          )}
          onClick={onOpen}
        >
          <div
            className={classNames('vtex-accordion-filter__item-title pv4', {
              'c-on-base t-small': open,
              'c-on-base t-heading-5': !open,
            })}
          >
            {getFilterTitle(title, intl)}
            <span className="vtex-accordion-filter__item-icon fr">
              <Arrow up={open} size={10} />
            </span>
          </div>
        </div>
      </div>
    )}
    {open && (
      <div className="vtex-accordion-filter__item-options pl7 overflow-scroll h-100">
        {options.map(opt => {
          const { Name } = opt

          return (
            <div
              className="vtex-filter-accordion__item-box pr4 pt3 items-center flex bb b--muted-5"
              key={Name}
            >
              <Checkbox
                className="mb0"
                checked={isOptionSelected(opt)}
                id={Name}
                label={Name}
                name={`checkbox-${Name}`}
                onChange={() => onFilterCheck(opt)}
                value={`option-${Name}`}
              />
            </div>
          )
        })}
      </div>
    )}
  </Fragment>
)

AccordionFilterItem.propTypes = {
  /** Title */
  title: PropTypes.string,
  /** Available filter options */
  options: PropTypes.arrayOf(facetOptionShape),
  /** Filter type (e.g. CATEGORIES_TYPE, BRANDS_TYPE) */
  type: PropTypes.string,
  /** Whether to show any of the content */
  show: PropTypes.bool,
  /** Whether to show the filter options */
  open: PropTypes.bool,
  /** Whether to hide other filters options when one is selected */
  oneSelectedCollapse: PropTypes.bool,
  /** Callback to open event */
  onOpen: PropTypes.func,
  /** Callback to filter option selected event */
  onItemSelected: PropTypes.func,
  /** Get the props to pass to render's Link */
  getLinkProps: PropTypes.func,
  /** Intl instance */
  intl: intlShape,
  /** Checkbox hit callback function */
  onFilterCheck: PropTypes.func,
}

export default injectIntl(AccordionFilterItem)
