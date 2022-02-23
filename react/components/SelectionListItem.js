import React from 'react'
import { useRuntime } from 'vtex.render-runtime'
import classNames from 'classnames'
import { useCssHandles, applyModifiers } from 'vtex.css-handles'
import { usePixel } from 'vtex.pixel-manager'

const CSS_HANDLES = ['orderByOptionItem']

const SelectionListItem = ({ option, onItemClick, selected }) => {
  const { setQuery } = useRuntime()
  const handles = useCssHandles(CSS_HANDLES)
  const { push } = usePixel()

  const handleOptionClick = () => {
    onItemClick()

    push({
      event: 'sortProducts',
      value: option.value,
    })

    setQuery({ order: option.value, page: undefined })
  }

  const highlight = selected ? 'bg-light-gray' : 'hover-bg-muted-5 bg-base'

  return (
    <button
      className={classNames(
        highlight,
        applyModifiers(handles.orderByOptionItem, selected ? 'selected' : ''),
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
