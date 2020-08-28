import React, { Fragment, useContext } from 'react'
import PropTypes from 'prop-types'
import { intlShape, injectIntl } from 'react-intl'
import classNames from 'classnames'
import { IconCaret } from 'vtex.store-icons'
import { Tag } from 'vtex.styleguide'
import { useCssHandles, applyModifiers } from 'vtex.css-handles'

import SettingsContext from './SettingsContext'
import { getFilterTitle } from '../constants/SearchHelpers'
import { generateSlug } from './FilterNavigator/legacy/hooks/useSelectedFilters'

const CSS_HANDLES = [
  'accordionFilterContainer',
  'accordionFilterContent',
  'accordionFilterItem',
  'filterAccordionItemBox',
  'accordionFilterItemActive',
  'accordionFilterItemHidden',
  'accordionFilterItemTitle',
  'accordionFilterItemTag',
  'accordionFilterItemIcon',
  'accordionSelectedFilters',
]

const AccordionFilterItem = ({
  title,
  show,
  open,
  onOpen,
  selectedFilters = [],
  intl,
  children,
}) => {
  const { showAppliedFiltersOverview } = useContext(SettingsContext)
  const handles = useCssHandles(CSS_HANDLES)
  const handleKeyDown = e => {
    if (e.key === ' ') {
      onOpen(e)
    }
  }
  const quantitySelected = selectedFilters.length

  const titleSlug = generateSlug(getFilterTitle(title, intl))

  return (
    <Fragment>
      {!open && (
        <div
          className={`${applyModifiers(
            handles.accordionFilterContainer,
            titleSlug
          )} pl7`}
        >
          <div
            role="button"
            tabIndex={0}
            className={classNames(
              handles.accordionFilterItem,
              applyModifiers(handles.filterAccordionItemBox, titleSlug),
              't-body pr5 pv3 pointer bb b--muted-5',
              {
                [handles.accordionFilterItemActive]: open,
                [`${handles.accordionFilterItemHidden} dn`]: !show,
              }
            )}
            onKeyDown={handleKeyDown}
            onClick={onOpen}
          >
            <div
              className={classNames(
                handles.accordionFilterContent,
                'pv4 c-on-base',
                {
                  't-small': open,
                  't-heading-5': !open,
                }
              )}
            >
              <span className={handles.accordionFilterItemTitle}>
                {getFilterTitle(title, intl)}
              </span>
              {quantitySelected !== 0 && (
                <div
                  className={classNames(
                    handles.accordionFilterItemTag,
                    'dib ml3'
                  )}
                >
                  <Tag>{quantitySelected}</Tag>
                </div>
              )}
              <span className={`${handles.accordionFilterItemIcon} fr`}>
                <IconCaret orientation="down" size={10} />
              </span>
              {showAppliedFiltersOverview && quantitySelected > 0 && (
                <div
                  className={classNames(
                    handles.accordionSelectedFilters,
                    'f6 c-action-primary'
                  )}
                >
                  {selectedFilters.map(facet => facet.name).join(', ')}
                </div>
              )}
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
  /** List of selected filters */
  selectedFilters: PropTypes.arrayOf(PropTypes.object),
  /** Intl instance */
  intl: intlShape,
  /** content */
  children: PropTypes.node,
}

export default injectIntl(AccordionFilterItem)
