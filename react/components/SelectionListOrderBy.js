import React, { useState, useCallback, useRef } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import classNames from 'classnames'
import { find, propEq } from 'ramda'
import { useRuntime } from 'vtex.render-runtime'
import { IconCaret } from 'vtex.store-icons'

import SelectionListItem from './SelectionListItem'
import useOutsideClick from '../hooks/useOutsideClick'
import searchResult from '../searchResult.css'

const SelectionListOrderBy = ({ intl, orderBy, options }) => {
  const [showDropdown, setShowDropdown] = useState(false)

  const orderByRef = useRef(null)

  const handleDropdownBtClick = useCallback(
    () => setShowDropdown(!showDropdown),
    [showDropdown]
  )

  const handleOutsideClick = useCallback(() => setShowDropdown(false), [])

  useOutsideClick(orderByRef, handleOutsideClick, showDropdown)

  const {
    hints: { mobile },
  } = useRuntime()

  const renderOptions = orderBy => {
    return options.map(option => {
      return (
        <SelectionListItem
          key={option.value}
          onItemClick={handleOutsideClick}
          option={option}
          selected={option.value === orderBy}
        />
      )
    })
  }

  const getOptionTitle = useCallback(
    option => find(propEq('value', option), options).label,
    [options]
  )

  const btClass = classNames(
    searchResult.orderByButton,
    'ph3 pv5 mv0 pointer flex items-center justify-end bg-base c-on-base t-action--small bt br bl bb-0 br2 br--top bw1 w-100 outline-0',
    {
      'b--muted-4': showDropdown && mobile,
      'b--transparent pl1': !showDropdown,
    }
  )

  const contentClass = classNames(
    searchResult.orderByOptionsContainer,
    'z-1 absolute bg-base shadow-5 w-100 f5 b--muted-4 br2 ba bw1 br--bottom top-0 right-0-ns',
    {
      db: showDropdown,
      dn: !showDropdown,
    }
  )

  const dropdownSort = classNames(
    searchResult.orderByDropdown,
    'relative pt1 justify-end w-100 w-auto-ns ml-auto'
  )

  return (
    <div className={dropdownSort} ref={orderByRef}>
      <button onClick={handleDropdownBtClick} className={btClass}>
        <span
          className={classNames(
            searchResult.filterPopupTitle,
            'c-on-base t-action--small ml-auto-ns'
          )}
        >
          <span
            className={classNames('c-muted-2', {
              'dn dib-ns': !orderBy.length,
            })}
          >
            {intl.formatMessage({ id: 'store/ordenation.sort-by' })}
          </span>{' '}
          {getOptionTitle(orderBy)}
        </span>
        <span className={`${searchResult.filterPopupArrowIcon} ph5 pt1`}>
          <IconCaret orientation="down" size={10} />
        </span>
      </button>

      <div className={contentClass}>{renderOptions(orderBy)}</div>
    </div>
  )
}

SelectionListOrderBy.propTypes = {
  /** Current Ordernation  */
  orderBy: PropTypes.string,
  /** Sort Options*/
  options: PropTypes.arrayOf(
    PropTypes.shape({
      /** Label to Option */
      label: PropTypes.string,
      /** Value to value */
      value: PropTypes.string,
    })
  ),
  /** Intl to translations */
  intl: intlShape,
}

export default injectIntl(SelectionListOrderBy)
