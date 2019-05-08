import React from 'react'
import { useRuntime } from 'vtex.render-runtime'

const SelectionListItem = ({ option, onItemClick }) => {
  const { setQuery } = useRuntime()

  const handleOptionClick = () => {
    onItemClick()
    setQuery({ order: option.value })
  }

  return (
    <button
      className="bg-base c-on-base f5 ml-auto db no-underline pointer tl bn pv4 ph5 hover-bg-muted-4 w-100"
      key={option.value}
      onClick={handleOptionClick}
    >
      {option.label}
    </button>
  )
}

export default SelectionListItem
