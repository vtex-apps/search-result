import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { useIntl } from 'react-intl'
import classNames from 'classnames'
import { Checkbox } from 'vtex.styleguide'
import { IconCaret } from 'vtex.store-icons'

import { facetOptionShape } from '../../../constants/propTypes'
import { getFilterTitle } from '../../../constants/SearchHelpers'
import searchResult from './searchResult.css'

const AccordionFilterItem = ({
  title,
  facets,
  show,
  open,
  onOpen,
  onFilterCheck,
  isOptionSelected,
}) => {
  const intl = useIntl()
  const handleKeyDown = (e) => {
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
              `${searchResult.accordionFilterItem} ${searchResult.filterAccordionItemBox} t-body pr5 pv3 pointer bb b--muted-5`,
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
      {open && (
        <div
          className={`${searchResult.accordionFilterItemOptions} pl7 overflow-scroll h-100`}
        >
          {facets.map((facet) => {
            const { name } = facet

            return (
              <div
                className={`${searchResult.filterAccordionItemBox} pr4 pt3 items-center flex bb b--muted-5`}
                key={name}
              >
                <Checkbox
                  className="mb0"
                  checked={isOptionSelected(facet)}
                  id={name}
                  label={name}
                  name={name}
                  onChange={() => onFilterCheck(facet)}
                  value={name}
                />
              </div>
            )
          })}
        </div>
      )}
    </Fragment>
  )
}

AccordionFilterItem.propTypes = {
  /** Title */
  title: PropTypes.string,
  /** Available filter options */
  facets: PropTypes.arrayOf(facetOptionShape),
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
  /** Checkbox hit callback function */
  onFilterCheck: PropTypes.func,
  isOptionSelected: PropTypes.func,
}

export default AccordionFilterItem
