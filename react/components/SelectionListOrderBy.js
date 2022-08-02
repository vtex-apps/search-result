import React, { useState, useCallback, useRef } from 'react'
import PropTypes from 'prop-types'
import { useIntl } from 'react-intl'
import classNames from 'classnames'
// eslint-disable-next-line no-restricted-imports
import { find, propEq } from 'ramda'
import { formatIOMessage } from 'vtex.native-types'
import { IconCaret } from 'vtex.store-icons'
import { useDevice } from 'vtex.device-detector'
import { useCssHandles } from 'vtex.css-handles'

import SelectionListItem from './SelectionListItem'
import useOutsideClick from '../hooks/useOutsideClick'
import styles from '../searchResult.css'

const CSS_HANDLES = [
  'orderByButton',
  'orderByOptionsContainer',
  'orderByDropdown',
  'orderByText',
  'filterPopupTitle',
  'filterPopupArrowIcon',
]

const SelectionListOrderBy = ({
  message = 'store/ordenation.sort-by',
  orderBy,
  options,
  showOrderTitle,
}) => {
  const intl = useIntl()
  const [showDropdown, setShowDropdown] = useState(false)
  const handles = useCssHandles(CSS_HANDLES)

  const orderByRef = useRef(null)

  const handleDropdownBtClick = useCallback(
    () => setShowDropdown(!showDropdown),
    [showDropdown]
  )

  const handleOutsideClick = useCallback(() => setShowDropdown(false), [])

  useOutsideClick(orderByRef, handleOutsideClick, showDropdown)

  const { isMobile } = useDevice()

  const renderOptions = orderByOption => {
    return options.map(option => {
      return (
        <SelectionListItem
          key={option.value}
          onItemClick={handleOutsideClick}
          option={option}
          selected={option.value === orderByOption}
        />
      )
    })
  }

  const sortByMessage = formatIOMessage({ id: message, intl })

  const getOptionTitle = useCallback(
    option => {
      const selectedOption = find(propEq('value', option), options)

      return selectedOption ? selectedOption.label : ''
    },
    [options]
  )

  const btClass = classNames(
    handles.orderByButton,
    'ph3 pv5 mv0 pointer flex items-center justify-end bg-base c-on-base t-action--small bt br bl bb-0 br2 br--top bw1 w-100 outline-0',
    {
      'b--muted-4': showDropdown && isMobile,
      'b--transparent pl1': !showDropdown,
    }
  )

  const contentClass = classNames(
    styles.orderByOptionsContainer,
    'z-3 absolute bg-base shadow-5 w-100 f5 b--muted-4 br2 ba bw1 br--bottom top-0 right-0-ns',
    {
      db: showDropdown,
      dn: !showDropdown,
    }
  )

  const dropdownSort = classNames(
    handles.orderByDropdown,
    'relative pt1 justify-end w-100 w-auto-ns ml-auto'
  )

  return (
    <div className={dropdownSort} ref={orderByRef}>
      <button onClick={handleDropdownBtClick} className={btClass}>
        <span
          className={classNames(
            handles.filterPopupTitle,
            'c-on-base t-action--small ml-auto-ns'
          )}
        >
          <span
            className={classNames(handles.orderByText, 'c-muted-2', {
              'dn dib-ns': !orderBy.length,
            })}
          >
            {sortByMessage}
          </span>{' '}
          {showOrderTitle ? getOptionTitle(orderBy) : null}
        </span>
        <span className={`${handles.filterPopupArrowIcon} ph5 pt1`}>
          <IconCaret orientation={showDropdown ? 'up' : 'down'} size={10} />
        </span>
      </button>

      <div className={contentClass}>{renderOptions(orderBy)}</div>
    </div>
  )
}

SelectionListOrderBy.propTypes = {
  /** Current Ordernation  */
  orderBy: PropTypes.string,
  /** Sort Options */
  options: PropTypes.arrayOf(
    PropTypes.shape({
      /** Label to Option */
      label: PropTypes.string,
      /** Value to value */
      value: PropTypes.string,
    })
  ),
  /** Message to be displayed */
  message: PropTypes.string,
  /** Show or hide order title */
  showOrderTitle: PropTypes.bool,
}

export default SelectionListOrderBy
