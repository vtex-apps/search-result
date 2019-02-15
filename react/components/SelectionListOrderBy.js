import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import classNames from 'classnames'
import { find, propEq } from 'ramda'

import OutsideClickHandler from 'react-outside-click-handler'
import { useRuntime, Link } from 'vtex.render-runtime'
import { IconCaret } from 'vtex.dreamstore-icons'

import searchResult from '../searchResult.css'

const SelectionListOrderBy = ({
  orderBy,
  getLinkProps,
  options,
  intl,
}) => {
  const [showDropdown, setShowDropdown] = useState(false)

  const handleDropdownBtClick = e => {
    e.preventDefault()
    setShowDropdown(!showDropdown)
  }

  const handleOutsideClick = e => {
    e.preventDefault()
    setShowDropdown(false)
  }

  const renderOptions = () => {
    return options.map(option => {
      const linkProps = getLinkProps({ ordenation: option.value })
      return (
        <Link
          key={option.value}
          page={linkProps.page}
          query={linkProps.queryString}
          params={linkProps.params}
          className="c-on-base f5 ml-auto db no-underline pv4 ph5 hover-bg-muted-4"
        >
          {option.label}
        </Link>
      )
    })
  }

  const getOptionTitle = option => {
    return find(propEq('value', option), options).label
  }

  const { hints: { mobile } } = useRuntime()

  const btClass = classNames('ph3 pv5 mv0 pointer flex justify-center items-center bg-base c-on-base t-action--small ml-auto bt br bl bb-0 br2 br--top bw1 w-100',
    {
      'b--muted-4 shadow-1': showDropdown && mobile,
      'b--transparent pl1': !showDropdown,
    }
  )

  const contentClass = classNames('z-1 absolute bg-base shadow-5 f5 w-100 b--muted-4 br2 ba bw1 br--bottom',
    {
      'db': showDropdown,
      'dn': !showDropdown,
    }
  )

  const dropdownSort = classNames(searchResult.dropdownSort, 'relative pt1 dib', {
    'flex-auto justify-center w-100': mobile,
  })

  return (
    <OutsideClickHandler onOutsideClick={handleOutsideClick}>
      <div className={dropdownSort}>
        <button onClick={handleDropdownBtClick} className={btClass}>
          <span className={`${searchResult.filterPopupTitle} c-on-base t-action--small ml-auto`}>{getOptionTitle(orderBy)} </span>
          <span className={`${searchResult.filterPopupArrowIcon} pt1 ml-auto`}>
            <IconCaret orientation="down" size={10} />
          </span>
        </button>
        <div className={contentClass}>
          {renderOptions()}
        </div>
      </div>
    </OutsideClickHandler>
  )
}

SelectionListOrderBy.propTypes = {
  orderBy: PropTypes.string,
  getLinkProps: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })),
  intl: intlShape,
}

export default injectIntl(SelectionListOrderBy)
