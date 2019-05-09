import PropTypes from 'prop-types'
import React, { useState, useCallback } from 'react'
import { Collapse } from 'react-collapse'
import classNames from 'classnames'

import { IconCaret } from 'vtex.store-icons'

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

  const handleFilterClass = () => { 
    return `${searchResult.filterName}--${title.replace(/\s+/, "")}`
  }

  const containerClassName = classNames(searchResult.filter, `${!selected ? handleFilterClass() : ""}` ,'pv5', {
    [searchResult.filterSelected]: selected,
    [searchResult.filterAvailable]: !selected,
  })

  const titleClassName = classNames(
    searchResult.filterTitle,
    't-heading-6 flex items-center justify-between',
    {
      ttu: selected,
    }
  )

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
                className={classNames(
                  searchResult.filterIcon,
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
          pb5: open,
        })}
        style={{ maxHeight: '200px' }}
        aria-hidden={!open}
      >
        {collapsable ? (
          <Collapse
            isOpened={open}
            theme={{ content: searchResult.filterContent }}
          >
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
}

export default FilterOptionTemplate
