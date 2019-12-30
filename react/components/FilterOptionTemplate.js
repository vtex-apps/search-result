import PropTypes from 'prop-types'
import React, { useState, useCallback, useContext } from 'react'
import { Collapse } from 'react-collapse'
import classNames from 'classnames'

import { IconCaret } from 'vtex.store-icons'
import { useCssHandles } from 'vtex.css-handles'
import { Input } from 'vtex.styleguide'
import { defineMessages, injectIntl, intlShape } from 'react-intl'

import SettingsContext from './SettingsContext'

import styles from '../searchResult.css'

const CSS_HANDLES = [
  'filter__container',
  'filter',
  'filterSelected',
  'filterAvailable',
  'filterTitle',
  'filterIcon',
  'filterContent',
  'filterSearch',
]

const messages = defineMessages({
  searchPlaceHolder: {
    id: 'store/search.filter.search-placeholder',
    defaultMessage: '',
  },
})

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
  intl,
}) => {
  const [open, setOpen] = useState(!initiallyCollapsed)
  const [searchTerm, setSearchTerm] = useState('')
  const handles = useCssHandles(CSS_HANDLES)

  const { orderFacetsBy, showFacetSearch } = useContext(SettingsContext)

  const sortFacets = useCallback(
    (a, b) => {
      switch (orderFacetsBy) {
        case 'QuantityDESC':
          return b.quantity - a.quantity
        case 'QuantityASC':
          return a.quantity - b.quantity
        case 'NameASC':
          return a.name > b.name ? 1 : -1
        case 'NameDESC':
          return a.name > b.name ? -1 : 1
        default:
          return 0
      }
    },
    [orderFacetsBy]
  )

  const renderChildren = () => {
    if (typeof children !== 'function') {
      return children
    }

    return filters
      .filter(
        filter =>
          searchTerm === '' ||
          filter.name.toLowerCase().indexOf(searchTerm) > -1
      )
      .sort(sortFacets)
      .map(children)
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
          onClick={() => collapsable && setOpen(!open)}
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
          <Collapse isOpened={open} theme={{ content: handles.filterContent }}>
            <div className={classNames('mb3', handles.filterSearch)}>
              {showFacetSearch ? (
                <Input
                  onChange={e => setSearchTerm(e.target.value.toLowerCase())}
                  placeholder={intl.formatMessage(messages.searchPlaceHolder, {
                    filterName: title,
                  })}
                />
              ) : null}
            </div>
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
  /** Intl instance */
  intl: intlShape,
}

export default injectIntl(FilterOptionTemplate)
