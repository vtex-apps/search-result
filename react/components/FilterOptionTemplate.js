import PropTypes from 'prop-types'
import React, { useState, useCallback } from 'react'
import { Collapse } from 'react-collapse'
import classNames from 'classnames'

import { IconCaret } from 'vtex.store-icons'

import styles from '../searchResult.css'

/**
 * Collapsable filters container
 */
const FilterOptionTemplate = ({
  id,
  selected = false,
  title,
  collapsable = true,
  children,
  filters,
  initiallyCollapsed = false,
}) => {
  const [open, setOpen] = useState(!initiallyCollapsed)

  const renderChildren = () => {
    if (typeof children !== 'function') {
      return children
    }

    return filters.map(children)
  }

  const handleKeyDown = useCallback(
    e => {
      if (e.key === ' ' && collapsable) {
        e.preventDefault()
        setOpen(!open)
      }
    },
    [collapsable, open]
  )

  const containerClassName = classNames(
    styles['filter__container'],
    { [`${styles['filter__container']}--${id}`]: id },
    'bb b--muted-4'
  )

  const titleContainerClassName = classNames(styles.filter, 'pv5', {
    [styles.filterSelected]: selected,
    [styles.filterAvailable]: !selected,
  })

  const titleClassName = classNames(
    styles.filterTitle,
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
          onClick={() => collapsable && setOpen(!open)}
          onKeyDown={handleKeyDown}
          aria-disabled={!collapsable}
        >
          <div className={titleClassName}>
            {title}
            {collapsable && (
              <span
                className={classNames(
                  styles.filterIcon,
                  'flex items-center ph5 c-muted-3'
                )}
              >
                <IconCaret orientation={open ? 'up' : 'down'} size={14} />
              </span>
            )}
          </div>
        </div>
      </div>
      <div
        className={classNames({
          'overflow-y-auto': collapsable,
          pb5: !collapsable || open,
        })}
        style={{ maxHeight: '200px' }}
        aria-hidden={!open}
      >
        {collapsable ? (
          <Collapse isOpened={open} theme={{ content: styles.filterContent }}>
            {renderChildren()}
          </Collapse>
        ) : (
          renderChildren()
        )}
      </div>
    </div>
  )
}

FilterOptionTemplate.propTypes = {
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

export default FilterOptionTemplate
