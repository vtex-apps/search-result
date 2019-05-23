import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { intlShape, injectIntl } from 'react-intl'
import classNames from 'classnames'
import { Tag } from 'vtex.styleguide'

import { IconCaret } from 'vtex.store-icons'

import { getFilterTitle } from '../constants/SearchHelpers'

import styles from '../searchResult.css'

const AccordionFilterItem = ({
  title,
  show,
  open,
  onOpen,
  quantitySelected = 0,
  intl,
  children,
}) => {
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
              styles.accordionFilterItem,
              styles.filterAccordionItemBox,
              't-body pr5 pv3 pointer bb b--muted-5',
              {
                [styles.accordionFilterItemActive]: open,
                [`${styles.accordionFilterItemHidden} dn`]: !show,
              }
            )}
            onKeyDown={handleKeyDown}
            onClick={onOpen}
          >
            <div
              className={classNames('pv4 c-on-base', {
                't-small': open,
                't-heading-5': !open,
              })}
            >
              <span className={styles.accordionFilterItemTitle}>
                {getFilterTitle(title, intl)}
              </span>
              {quantitySelected !== 0 && (
                <div
                  className={classNames(
                    styles.accordionFilterItemTag,
                    'dib ml3'
                  )}
                >
                  <Tag>{quantitySelected}</Tag>
                </div>
              )}
              <span className={`${styles.accordionFilterItemIcon} fr`}>
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
  /** Quantity of selected filters */
  quantitySelected: PropTypes.number,
  /** Intl instance */
  intl: intlShape,
  /** content */
  children: PropTypes.node,
}

export default injectIntl(AccordionFilterItem)
