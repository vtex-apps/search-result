import React, { useState, useCallback, useRef } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import cx from 'classnames'
import { find, propEq } from 'ramda'
import { useRuntime } from 'vtex.render-runtime'
import { IconCaret } from 'vtex.dreamstore-icons'

import SelectionListItem from './SelectionListItem'
import useOutsideClick from '../hooks/useOutsideClick'
import searchResult from '../searchResult.css'

const SelectionListOrderBy = ({ orderBy, options }) => {
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

  const renderOptions = () => {
    return options.map(option => {
      return (
        <SelectionListItem
          key={option.value}
          onItemClick={handleOutsideClick}
          option={option}
        />
      )
    })
  }

  const getOptionTitle = useCallback(
    option => find(propEq('value', option), options).label,
    [options]
  )

  const btClass = cx(
    'ph3 pv5 mv0 pointer flex justify-center items-center bg-base c-on-base t-action--small bt br bl bb-0 br2 br--top bw1 w-100',
    {
      'b--muted-4 shadow-1': showDropdown && mobile,
      'b--transparent pl1': !showDropdown,
    }
  )

  const contentClass = cx(
    'z-1 absolute bg-base shadow-5 f5 w-100 b--muted-4 br2 ba bw1 br--bottom',
    {
      db: showDropdown,
      dn: !showDropdown,
    }
  )

  const dropdownSort = cx(
    searchResult.dropdownSort,
    'relative pt1 justify-center w-100 w-auto-ns center'
  )

  return (
    <div className={dropdownSort} ref={orderByRef}>
      <button onClick={handleDropdownBtClick} className={btClass}>
        <span
          className={cx(
            searchResult.filterPopupTitle,
            'c-on-base t-action--small ml-auto-ns'
          )}
        >
          <span className={cx('c-muted-2', { 'dn dib-ns': !orderBy.length })}>
            {getOptionTitle('')}
          </span>{' '}
          {getOptionTitle(orderBy)}
        </span>
        <span className={`${searchResult.filterPopupArrowIcon} ph5 pt1`}>
          <IconCaret orientation="down" size={10} />
        </span>
      </button>

      <div className={contentClass}>{renderOptions()}</div>
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
