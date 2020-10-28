import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import { useIntl, FormattedMessage } from 'react-intl'
import classNames from 'classnames'
import { IconCaret } from 'vtex.store-icons'
import { Tag } from 'vtex.styleguide'
import { useCssHandles, applyModifiers } from 'vtex.css-handles'
import { Collapse } from 'react-collapse'

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
  children,
  appliedFiltersOverview,
  navigationType,
  initiallyCollapsed,
  onClearFilter,
  facetKey,
  showClearByFilter,
}) => {
  const intl = useIntl()
  const handles = useCssHandles(CSS_HANDLES)
  const isNavigationCollapsible = navigationType === 'collapsible'
  const [isCollapsed, setIsCollapsed] = useState(initiallyCollapsed)

  const handleOnOpen = (e) => {
    if (isNavigationCollapsible) {
      setIsCollapsed((prevIsCollapsed) => !prevIsCollapsed)
    }

    onOpen(e)
  }

  const handleKeyDown = (e) => {
    if (e.key === ' ') {
      handleOnOpen(e)
    }
  }

  const quantitySelected = selectedFilters.length

  const titleSlug = generateSlug(getFilterTitle(title, intl))

  return (
    <Fragment>
      {(!open || isNavigationCollapsible) && (
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
              't-body pr5 pv3 pointer bb b--muted-5 outline-0',
              {
                [handles.accordionFilterItemActive]: open,
                [`${handles.accordionFilterItemHidden} dn`]: !show,
              }
            )}
            onKeyDown={handleKeyDown}
            onClick={handleOnOpen}
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
              {quantitySelected > 0 && showClearByFilter && (
                <span
                  className={classNames(
                    handles.accordionFilterItemTag,
                    'dib ml3'
                  )}
                >
                  <Tag
                    size="small"
                    onClick={e => {
                      e.stopPropagation()
                      onClearFilter && onClearFilter(facetKey)
                    }}
                  >
                    <FormattedMessage id="store/search-result.filter-button.clear" />
                  </Tag>
                </span>
              )}
              <span className={`${handles.accordionFilterItemIcon} fr`}>
                <IconCaret
                  orientation={
                    !isNavigationCollapsible ||
                    (isNavigationCollapsible && isCollapsed)
                      ? 'down'
                      : 'up'
                  }
                  size={10}
                />
              </span>
              {appliedFiltersOverview === 'show' && quantitySelected > 0 && (
                <div
                  className={classNames(handles.accordionSelectedFilters, 'f6')}
                >
                  {selectedFilters.map((facet) => facet.name).join(', ')}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {!isNavigationCollapsible ? (
        open && children
      ) : (
        <Collapse isOpened={!isCollapsed && isNavigationCollapsible}>
          <div className="pl8">{children}</div>
        </Collapse>
      )}
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
  /** content */
  children: PropTypes.node,
  /** Whether an overview of the applied filters should be displayed (`"show"`) or not (`"hide"`). */
  appliedFiltersOverview: PropTypes.string,
  /** Defines the navigation method: 'page' or 'collapsible' */
  navigationType: PropTypes.oneOf(['page', 'collapsible']),
  /** Makes the search filters start out collapsed (`true`) or open (`false`) */
  initiallyCollapsed: PropTypes.bool,
  /** Clear filter function */
  onClearFilter: PropTypes.func,
  /** Facet's key */
  facetKey: PropTypes.string,
  /** Whether a clear button that clear all options in a specific filter should appear beside the filter's name (true) or not (false). */
  showClearByFilter: PropTypes.bool,
}

export default AccordionFilterItem
