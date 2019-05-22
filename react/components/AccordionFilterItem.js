import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { intlShape, injectIntl } from 'react-intl'
import classNames from 'classnames'

import { IconCaret } from 'vtex.store-icons'

import { getFilterTitle } from '../constants/SearchHelpers'

import searchResult from '../searchResult.css'

const AccordionFilterItem = ({ title, show, open, onOpen, intl, children }) => {
  const handleKeyDown = e => {
    if (e.key === ' ') {
      onOpen(e)
    }
  }

  return (
    <Fragment>
      {!open && (
        <div className="pl7">
          <div
            role="button"
            tabIndex={0}
            className={classNames(
              `${searchResult.accordionFilterItem} ${
                searchResult.filterAccordionItemBox
              } t-body pr5 pv3 pointer bb b--muted-5`,
              {
                [searchResult.accordionFilterItemActive]: open,
                [`${searchResult.accordionFilterItemHidden} dn`]: !show,
              }
            )}
            onKeyDown={handleKeyDown}
            onClick={onOpen}
          >
            <div
              className={classNames(
                `${searchResult.accordionFilterItemTitle} pv4`,
                {
                  'c-on-base t-small': open,
                  'c-on-base t-heading-5': !open,
                }
              )}
            >
              {getFilterTitle(title, intl)}
              <span className={`${searchResult.accordionFilterItemIcon} fr`}>
                <IconCaret orientation="down" size={10} />
              </span>
            </div>
          </div>
        </div>
      )}
      {open && children}
    </Fragment>
  )
}

AccordionFilterItem.propTypes = {
  /** Title */
  title: PropTypes.string,
  /** Whether to show any of the content */
  show: PropTypes.bool,
  /** Whether to show the filter options */
  open: PropTypes.bool,
  /** Callback to open event */
  onOpen: PropTypes.func,
  /** Intl instance */
  intl: intlShape,
  /** content */
  children: PropTypes.node,
}

export default injectIntl(AccordionFilterItem)
