import React from 'react'
import { useRuntime } from 'vtex.render-runtime'
import classNames from 'classnames'
import searchResult from '../searchResult.css'

const SelectionListItem = ({ option, onItemClick, selected }) => {
  const { setQuery } = useRuntime()

  const handleOptionClick = () => {
    onItemClick()
    setQuery({ order: option.value })
  }

  const highlight = selected ? 'bg-light-gray' : 'hover-bg-muted-5 bg-base'

  return (
    <button
      className={classNames(
        searchResult.orderByOptionItem,
        highlight,
        ' c-on-base f5 ml-auto db no-underline pointer tl bn pv4 ph5 w-100 right-0-ns'
      )}
      key={option.value}
      onClick={handleOptionClick}
    >
      {option.label}
    </button>
  )
}

export default SelectionListItem
