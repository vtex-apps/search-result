import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { intlShape, injectIntl } from 'react-intl'
import classNames from 'classnames'
import { Link } from 'render'

import Arrow from '../images/Arrow'
import CheckTick from '../images/CheckTick'
import { facetOptionShape } from '../constants/propTypes'
import { getFilterTitle } from '../constants/SearchHelpers'

const AccordionFilterItem = ({
  title,
  options,
  type,
  show,
  open,
  onOpen,
  onItemSelected,
  getLinkProps,
  intl,
  oneSelectedCollapse,
}) => (
  <Fragment>
    <div
      className={classNames('vtex-accordion-filter__item fw3 pv3 ph7 pointer bb b--light-gray', {
        'vtex-accordion-filter__item--active': open,
        'vtex-accordion-filter__item--hidden dn': !show,
      })}
      onClick={onOpen}
    >
      <div
        className={classNames('vtex-accordion-filter__item-title', {
          'normal dark-gray': open,
        })}
      >
        {getFilterTitle(title, intl)}

        <span className="vtex-accordion-filter__item-icon fr">
          <Arrow up={open} size={10} />
        </span>
      </div>
    </div>
    {open && (
      <div className="vtex-accordion-filter__item-options">
        {options.map(opt => {
          const pagesArgs = getLinkProps({
            ...opt,
            name: opt.Name,
            link: opt.Link,
            path: opt.path,
            type,
            oneSelectedCollapse,
          })

          return (
            <Link
              key={opt.Name}
              className="vtex-accordion-filter__item-opt pv3 ph7 pointer bb b--light-gray link fw3 db dark-gray"
              page={pagesArgs.page}
              params={pagesArgs.params}
              query={pagesArgs.queryString}
              onClick={onItemSelected}
            >
              {opt.Name}

              {false && (
                <span className="vtex-accordion-filter__check-icon fr">
                  <CheckTick />
                </span>
              )}
            </Link>
          )
        })}
      </div>
    )}
  </Fragment>
)

AccordionFilterItem.propTypes = {
  title: PropTypes.string,
  options: PropTypes.arrayOf(facetOptionShape),
  type: PropTypes.string,
  show: PropTypes.bool,
  open: PropTypes.bool,
  oneSelectedCollapse: PropTypes.bool,
  onOpen: PropTypes.func,
  onItemSelected: PropTypes.func,
  getLinkProps: PropTypes.func,
  intl: intlShape,
}

export default injectIntl(AccordionFilterItem)
