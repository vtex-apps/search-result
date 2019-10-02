import React from 'react'
import { useRuntime } from 'vtex.render-runtime'
import classNames from 'classnames'
import searchResult from '../searchResult.css'

const SelectionListItem = ({ option, onItemClick, selected }) => {
  const { navigate } = useRuntime()

  const handleOptionClick = () => {
    onItemClick()
    const urlParams = new URLSearchParams(window.location.search)
    urlParams.set('order', option.value)
    urlParams.delete('page')
    /* Ideally this should be a setQuery since it behaves better in terms of
    UX and performance, but right now this is not possible because the setQuery
    alone does not reset the values of useFetchMore, which causes a bug on the
    fetch more/previous buttons behaviour.
    */
    navigate({
      to: window.location.pathname,
      query: urlParams.toString(),
    })
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
