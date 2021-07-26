import PropTypes from 'prop-types'
import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
  useContext,
} from 'react'
import { FormattedMessage } from 'react-intl'
import { Collapse } from 'react-collapse'
import classNames from 'classnames'
import { useRuntime } from 'vtex.render-runtime'
import { IconCaret } from 'vtex.store-icons'
import { useCssHandles } from 'vtex.css-handles'
import { Tag } from 'vtex.styleguide'

import styles from '../searchResult.css'
import { SearchFilterBar } from './SearchFilterBar'
import SettingsContext from './SettingsContext'
import useOutsideClick from '../hooks/useOutsideClick'
import ShowMoreFilterButton from './ShowMoreFilterButton'
import { useRenderOnView } from '../hooks/useRenderOnView'
import { FACETS_RENDER_THRESHOLD } from '../constants/filterConstants'

/** Returns true if elementRef has ever been scrolled */
const useHasScrolled = (elementRef) => {
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
  'filterIsOpen',
  'filterTitle',
  'filterIcon',
  'filterContent',
  'filterTemplateOverflow',
  'seeMoreButton',
  'filterSelectedFilters',
]

const useSettings = () => useContext(SettingsContext)
/**
 * Collapsable filters container
 */
const FilterOptionTemplate = ({
  id,
  selected = false,
  title,
  quantity,
  collapsable = true,
  children,
  filters,
  initiallyCollapsed = false,
  lazyRender = false,
  truncateFilters = false,
  lastOpenFilter,
  setLastOpenFilter,
  openFiltersMode,
  truncatedFacetsFetched,
  setTruncatedFacetsFetched,
  closeOnOutsideClick = false,
  appliedFiltersOverview,
  navigateToFacet,
  showClearByFilter,
  preventRouteChange,
}) => {
  const [open, setOpen] = useState(!initiallyCollapsed)
  const { getSettings } = useRuntime()
  const scrollable = useRef()
  const filterRef = useRef()
  const handles = useCssHandles(CSS_HANDLES)
  const { thresholdForFacetSearch } = useSettings()
  const [searchTerm, setSearchTerm] = useState('')
  const [truncated, setTruncated] = useState(true)

  const isLazyRenderEnabled = getSettings('vtex.store')
    ?.enableSearchRenderingOptimization

  const isLazyFacetsFetchEnabled = getSettings('vtex.store')
    ?.enableFiltersFetchOptimization

  const { hasBeenViewed, dummyElement } = useRenderOnView({
    lazyRender: isLazyRenderEnabled && lazyRender,
    waitForUserInteraction: false,
  })

  const hasScrolled = useHasScrolled(scrollable)
  const isOpen = openFiltersMode === 'many' ? open : lastOpenFilter === title

  const filteredFacets = useMemo(() => {
    if (thresholdForFacetSearch === undefined || searchTerm === '') {
      return filters
    }

    return filters.filter(
      (filter) =>
        filter.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
    )
  }, [filters, searchTerm, thresholdForFacetSearch])

  const openTruncated = (value) => {
    if (isLazyFacetsFetchEnabled && !truncatedFacetsFetched) {
      setTruncatedFacetsFetched(true)
    }

    setTruncated(value)
  }

  const handleClear = useCallback(
    () =>
      navigateToFacet(
        filters.filter((filter) => filter.selected),
        preventRouteChange
      ),
    [navigateToFacet, filters, preventRouteChange]
  )

  const renderChildren = () => {
    if (typeof children !== 'function') {
      return children
    }

    const shouldTruncate =
      (truncateFilters || isLazyFacetsFetchEnabled) &&
      quantity > FACETS_RENDER_THRESHOLD + 1

    const shouldLazyRender =
      !shouldTruncate && !hasScrolled && isLazyRenderEnabled

    /** Inexact measure but good enough for displaying a properly sized scrollbar */
    const placeholderSize = shouldLazyRender
      ? (filters.length - FACETS_RENDER_THRESHOLD) * 34
      : 0

    const endSlice =
      shouldLazyRender || (shouldTruncate && truncated)
        ? FACETS_RENDER_THRESHOLD
        : filteredFacets.length

    return (
      <>
        {filteredFacets.slice(0, endSlice).map(children)}
        {placeholderSize > 0 && <div style={{ height: placeholderSize }} />}
        {shouldTruncate && (
          <ShowMoreFilterButton
            quantity={quantity - FACETS_RENDER_THRESHOLD}
            truncated={truncated}
            toggleTruncate={() => openTruncated((isTruncated) => !isTruncated)}
          />
        )}
      </>
    )
  }

  const handleCollapse = useCallback(() => {
    if (openFiltersMode === 'many') {
      setOpen(!open)
    } else if (openFiltersMode === 'one') {
      setLastOpenFilter(lastOpenFilter === title ? null : title)
    } else {
      console.error(
        `Invalid openFiltersMode value: ${openFiltersMode}\nCheck the documentation for the values available`
      )
    }
  }, [lastOpenFilter, open, openFiltersMode, setLastOpenFilter, title])

  useOutsideClick(
    filterRef,
    () => {
      // closeOnOutsideClick only works with openFiltersMode == 'one'
      if (closeOnOutsideClick && openFiltersMode === 'one') {
        handleCollapse()
      }
    },
    isOpen
  )
  const showClearButton =
    showClearByFilter &&
    !selected &&
    filters &&
    filters.some((filter) => filter.selected)

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === ' ' && collapsable) {
        e.preventDefault()
        handleCollapse()
      }
    },
    [collapsable, handleCollapse]
  )

  const containerClassName = classNames(
    handles.filter__container,
    { [`${styles.filter__container}--${id}`]: id },
    'bb b--muted-4'
  )

  const titleContainerClassName = classNames(handles.filter, 'pv5', {
    [handles.filterSelected]: selected,
    [handles.filterAvailable]: !selected,
    [handles.filterIsOpen]: isOpen,
  })

  const titleClassName = classNames(
    handles.filterTitle,
    'f5 flex items-center justify-between',
    {
      ttu: selected,
    }
  )

  return (
    <div className={containerClassName} ref={filterRef}>
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
            <span>
              {title}
              {showClearButton && (
                <span className="ml2">
                  <Tag
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleClear()
                    }}
                  >
                    <FormattedMessage id="store/search-result.filter-button.clear" />
                  </Tag>
                </span>
              )}
            </span>
            {collapsable && (
              <span
                className={classNames(
                  handles.filterIcon,
                  'flex items-center ph5 c-muted-3'
                )}
              >
                <IconCaret orientation={isOpen ? 'up' : 'down'} size={14} />
              </span>
            )}
          </div>
        </div>
        {appliedFiltersOverview === 'show' && filters && !selected && (
          <div className={classNames(handles.filterSelectedFilters, 'f6')}>
            {filters
              .filter((facet) => facet.selected)
              .map((facet) => facet.name)
              .join(', ')}
          </div>
        )}
      </div>
      <div
        className={classNames(handles.filterTemplateOverflow, {
          'overflow-y-auto': collapsable,
          pb5: !collapsable || isOpen,
        })}
        ref={scrollable}
        data-testid="scrollable-element"
        style={
          !selected &&
          (!(truncateFilters || isLazyFacetsFetchEnabled) ||
            isLazyRenderEnabled)
            ? { maxHeight: '200px' }
            : {}
        }
        aria-hidden={!isOpen}
      >
        {!hasBeenViewed ? (
          dummyElement
        ) : collapsable ? (
          <Collapse
            isOpened={isOpen}
            theme={{ content: handles.filterContent }}
          >
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
  /** Last open filter */
  lastOpenFilter: PropTypes.string,
  /** Sets the last open filter */
  setLastOpenFilter: PropTypes.func,
  /** Dictates how many filters can be open at the same time */
  openFiltersMode: PropTypes.string,
  /** If the truncated facets were fetched */
  truncatedFacetsFetched: PropTypes.bool,
  /** Sets if the truncated facets were fetched */
  setTruncatedFacetsFetched: PropTypes.func,
  /** Quantity of facets of the current filter */
  quantity: PropTypes.number,
  closeOnOutsideClick: PropTypes.bool,
  /** Whether an overview of the applied filters should be displayed (`"show"`) or not (`"hide"`). */
  appliedFiltersOverview: PropTypes.string,
  navigateToFacet: PropTypes.func,
  showClearByFilter: PropTypes.bool,
  preventRouteChange: PropTypes.bool,
}

export default FilterOptionTemplate
