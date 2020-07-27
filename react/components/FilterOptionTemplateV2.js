import PropTypes from 'prop-types'
import React, { useState, useCallback, useEffect } from 'react'
import { Collapse } from 'react-collapse'
import classNames from 'classnames'

import { IconCaret } from 'vtex.store-icons'
import { useCssHandles } from 'vtex.css-handles'

import styles from '../searchResult.css'

const CSS_HANDLES = [
  'filter__container',
  'filter',
  'filterSelected',
  'filterAvailable',
  'filterTitle',
  'filterIcon',
  'filterContent',
  'filterTemplateOverflow',
]
/**
 * Collapsable filters container
 */
const FilterOptionTemplateV2 = ({
  id,
  selected = false,
  title,
  collapsable = true,
  children,
  filters,
  initiallyCollapsed = false,
  open,
  setOpen
}) => {
  const handles = useCssHandles(CSS_HANDLES)

  const renderChildren = () => {
    if (typeof children !== 'function') {
      return children
    }

    return filters.map(children)
  }

  const handleCollapse = () => {
    setOpen(open === title ? null : title)
  }

  const handleKeyDown = useCallback(
    e => {
      if (e.key === ' ' && collapsable) {
        e.preventDefault()
        handleCollapse()
      }
    },
    [collapsable, open]
  )

  const containerClassName = classNames(
    handles.filter__container,
    { [`${styles['filter__container']}--${id}`]: id },
    'bb b--muted-4'
  )

  const titleContainerClassName = classNames(handles.filter, 'pv5', {
    [handles.filterSelected]: selected,
    [handles.filterAvailable]: !selected,
  })

  const titleClassName = classNames(
    handles.filterTitle,
    'f5 flex items-center justify-between',
    {
      ttu: selected,
    }
  )

  return (
    <div className={containerClassName}>
      <div className={titleContainerClassName}>
        <div
          role="button"
          tabIndex={collapsable ? 0 : undefined}
          className={collapsable ? 'pointer' : ''}
          onClick={() => collapsable && handleCollapse()}
          onKeyDown={handleKeyDown}
          aria-disabled={!collapsable}
        >
          <div className={titleClassName}>
            {title}
            {collapsable && (
              <span
                className={classNames(
                  handles.filterIcon,
                  'flex items-center ph5 c-muted-3'
                )}
              >
                <IconCaret orientation={title === open ? 'up' : 'down'} size={14} />
              </span>
            )}
          </div>
        </div>
      </div>
      <div
        className={classNames(handles.filterTemplateOverflow, {
          'overflow-y-auto': collapsable,
          pb5: !collapsable || open,
        })}
        style={{ maxHeight: '200px' }}
        aria-hidden={!open}
      >
        {collapsable ? (
          <Collapse isOpened={title === open} theme={{ content: handles.filterContent }}>
            {renderChildren()}
          </Collapse>
        ) : (
            renderChildren()
          )}
      </div>
    </div>
  )
}

FilterOptionTemplateV2.propTypes = {
  /** Identifier to be used by CSS handles */
  id: PropTypes.string,
  /** Filters to be shown, if no filter is provided, treat the children as simple node */
  filters: PropTypes.arrayOf(PropTypes.object),
  /** Function to handle filter rendering or node if no filter is provided */
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
  /** Title */
  title: PropTypes.node,
  /** Whether collapsing is enabled */
  collapsable: PropTypes.bool,
  /** Whether it represents the selected filters */
  selected: PropTypes.bool,
  initiallyCollapsed: PropTypes.bool,
}

export default FilterOptionTemplateV2
