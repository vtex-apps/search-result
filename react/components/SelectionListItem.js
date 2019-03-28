import React from 'react'
import { useRuntime } from 'vtex.render-runtime'

const SelectionListItem = ({ option, onItemClick }) => {
  const { navigate } = useRuntime()

  const handleOptionClick = () => {
    const queryParams = new URLSearchParams(window.location.search)

    queryParams.set('order', option.value)

    onItemClick()

    navigate({
      to: window.location.pathname,
      query: queryParams.toString(),
    })
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
