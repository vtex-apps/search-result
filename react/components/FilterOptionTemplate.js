import PropTypes from 'prop-types'
import React, { useState, useCallback } from 'react'
import { Collapse } from 'react-collapse'
import cx from 'classnames'

import { IconCaret } from 'vtex.dreamstore-icons'

import searchResult from '../searchResult.css'

/**
 * Collapsable filters container
 */
const FilterOptionTemplate = ({
  selected = false,
  title,
  collapsable = true,
  children,
  filters,
  className,
}) => {
  const [open, setOpen] = useState(true)

  const renderChildren = () => {
    if (typeof children !== 'function') {
      return children
    }

    return filters.map(children)
  }

  const handleKeyDown = useCallback(
    e => {
      if (e.key === ' ') {
        e.preventDefault()
        setOpen(!open)
      }
    },
    [open]
  )

  const containerClassName = cx(searchResult.filter, 'pv5', {
    [searchResult.filterSelected]: selected,
    [searchResult.filterAvailable]: !selected,
  })

  const titleClassName = cx(
    searchResult.filterTitle,
    't-heading-6 flex items-center justify-between',
    {
      ttu: selected,
    }
  )

  // Backwards-compatible support
  if (typeof children === 'function' && !filters.length) {
    return null
  }

  return (
    <div className="bb b--muted-4">
      <div className={containerClassName}>
        <div
          role="button"
          tabIndex={0}
          className={collapsable ? 'pointer' : ''}
          onClick={() => setOpen(!open)}
          onKeyDown={handleKeyDown}
        >
          <div className={titleClassName}>
            {title}
            {collapsable && (
              <span
                className={cx(
                  searchResult.filterIcon,
                  'flex items-center ph5 c-muted-3'
                )}
              >
                {open ? (
                  <IconCaret orientation="up" size={14} />
                ) : (
                  <IconCaret orientation="down" size={14} />
                )}
              </span>
            )}
          </div>
        </div>
      </div>
      <div
        className={cx(className, {
          'overflow-y-auto': collapsable,
          pb5: open,
        })}
        style={{ maxHeight: '200px' }}
        aria-hidden={!open}
      >
        {collapsable ? (
          <Collapse isOpened={open}>{renderChildren()}</Collapse>
        ) : (
          renderChildren()
        )}
      </div>
    </div>
  )
}

FilterOptionTemplate.propTypes = {
  /** Content class names */
  className: PropTypes.string,
  /** Filters to be shown, if no filter is provided, treat the children as simple node */
  filters: PropTypes.arrayOf(PropTypes.object),
  /** Function to handle filter rendering or node if no filter is provided */
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
  /** Title */
  title: PropTypes.string.isRequired,
  /** Whether collapsing is enabled */
  collapsable: PropTypes.bool,
  /** Whether it represents the selected filters */
  selected: PropTypes.bool,
}

export default FilterOptionTemplate
