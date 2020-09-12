import PropTypes from 'prop-types'
import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
  useContext,
} from 'react'
import { Collapse } from 'react-collapse'
import classNames from 'classnames'
import { FormattedMessage } from 'react-intl'

import { useRuntime } from 'vtex.render-runtime'
import { IconCaret } from 'vtex.store-icons'
import { useCssHandles } from 'vtex.css-handles'

import styles from '../searchResult.css'
import { SearchFilterBar } from './SearchFilterBar'
import SettingsContext from './SettingsContext'

import { useRenderOnView } from '../hooks/useRenderOnView'

/** Returns true if elementRef has ever been scrolled */
const useHasScrolled = elementRef => {
  const [hasScrolled, setHasScrolled] = useState(false)

  useEffect(() => {
    const scrollableElement = elementRef.current
    if (hasScrolled || !scrollableElement) {
      return
    }

    const handleScroll = () => {
      setHasScrolled(true)
    }

    scrollableElement.addEventListener('scroll', handleScroll)

    return () => {
      scrollableElement.removeEventListener('scroll', handleScroll)
    }
  }, [hasScrolled, elementRef])

  return hasScrolled
}

const CSS_HANDLES = [
  'filter__container',
  'filter',
  'filterSelected',
  'filterAvailable',
  'filterTitle',
  'filterIcon',
  'filterContent',
  'filterTemplateOverflow',
  'seeMoreButton',
]

const useSettings = () => useContext(SettingsContext)

const MAX_ITEMS_THRESHOLD = 12

/** Renders only ${RENDER_THRESHOLD} items on the list until the user scrolls or clicks `See more`,
 * for improved rendering performance */
const RENDER_THRESHOLD = 10

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
  lazyRender = false,
  truncateFilters = false,
}) => {
  const [open, setOpen] = useState(!initiallyCollapsed)
  const { getSettings } = useRuntime()
  const scrollable = useRef()
  const handles = useCssHandles(CSS_HANDLES)
  const { thresholdForFacetSearch } = useSettings()
  const [searchTerm, setSearchTerm] = useState('')
  const [truncated, setTruncated] = useState(true)

  const isLazyRenderEnabled = getSettings('vtex.store')
    ?.enableSearchRenderingOptimization

  const { hasBeenViewed, dummyElement } = useRenderOnView({
    lazyRender: isLazyRenderEnabled && lazyRender,
    waitForUserInteraction: false,
  })

  const hasScrolled = useHasScrolled(scrollable)

  const filteredFacets = useMemo(() => {
    if (thresholdForFacetSearch === undefined || searchTerm === '') {
      return filters
    }
    return filters.filter(
      filter => filter.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
    )
  }, [filters, searchTerm, thresholdForFacetSearch])

  const renderChildren = () => {
    if (typeof children !== 'function') {
      return children
    }

    const shouldTruncate =
      truncateFilters && filteredFacets.length >= MAX_ITEMS_THRESHOLD

    const shouldLazyRender =
      !shouldTruncate && !hasScrolled && isLazyRenderEnabled

    /** Inexact measure but good enough for displaying a properly sized scrollbar */
    const placeholderSize = shouldLazyRender
      ? (filters.length - RENDER_THRESHOLD) * 34
      : 0

    const endSlice =
      shouldLazyRender || (shouldTruncate && truncated)
        ? RENDER_THRESHOLD
        : filteredFacets.length

    return (
      <>
        {filteredFacets.slice(0, endSlice).map(children)}
        {placeholderSize > 0 && <div style={{ height: placeholderSize }} />}
        {shouldTruncate && (
          <button
            onClick={() => setTruncated(truncated => !truncated)}
            className={`${handles.seeMoreButton} mt2 pv2 bn pointer c-link`}
          >
            <FormattedMessage
              id={
                truncated
                  ? 'store/filter.more-items'
                  : 'store/filter.less-items'
              }
              values={{ quantity: filteredFacets.length - RENDER_THRESHOLD }}
            />
          </button>
        )}
      </>
    )
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
        className={classNames(handles.filterTemplateOverflow, {
          'overflow-y-auto': collapsable,
          pb5: !collapsable || open,
        })}
        ref={scrollable}
        style={
          !truncateFilters || isLazyRenderEnabled ? { maxHeight: '200px' } : {}
        }
        aria-hidden={!open}
      >
        {!hasBeenViewed ? (
          dummyElement
        ) : collapsable ? (
          <Collapse isOpened={open} theme={{ content: handles.filterContent }}>
            {thresholdForFacetSearch !== undefined &&
            thresholdForFacetSearch < filters.length ? (
              <SearchFilterBar name={title} handleChange={setSearchTerm} />
            ) : null}
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
  /** Internal prop, whether this component should be rendered only on view */
  lazyRender: PropTypes.bool,
  /** When `true`, truncates filters with more than 10 options displaying a button to see all */
  truncateFilters: PropTypes.bool,
}

export default FilterOptionTemplate
