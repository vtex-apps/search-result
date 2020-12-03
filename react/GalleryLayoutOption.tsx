import React, { ComponentType } from 'react'

import { useCssHandles, applyModifiers } from 'vtex.css-handles'
import { SearchPageContext } from 'vtex.search-page-context'
import { SWITCH_GALLERY_LAYOUT_TYPE } from './constants'

const { useSearchPageState, useSearchPageStateDispatch } = SearchPageContext

interface OptionSlot {
  isActive?: boolean
}

interface GalleryLayoutOptionProps {
  /** Component to show before label*/
  Option: ComponentType<OptionSlot>
  /** Unique name to match layout name */
  name: string
  /** Label of the option */
  label?: string
}

const CSS_HANDLES = [
  'galleryLayoutOptionButton',
  'galleryLayoutOptionContainer',
  'galleryLayoutOptionLabel',
] as const

const GalleryLayoutOption: React.FC<GalleryLayoutOptionProps> = ({
  Option,
  name,
  label,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  const { galleryLayout } = useSearchPageState()
  const dispatch = useSearchPageStateDispatch()

  const selected = name === galleryLayout

  const handleOptionClick = () => {
    dispatch({
      type: SWITCH_GALLERY_LAYOUT_TYPE,
      args: { galleryLayout: name },
    })
  }

  return (
    <button
      className={`${applyModifiers(
        handles.galleryLayoutOptionButton,
        selected ? 'selected' : ''
      )} bw0 pointer outline-0 bg-transparent`}
      onClick={handleOptionClick}
      role="radio"
      aria-checked={selected}
      aria-controls="gallery-layout-container"
      aria-label={`Switch to ${name} layout`}
    >
      <div className={handles.galleryLayoutOptionContainer}>
        <Option isActive={selected} />
        <span className={handles.galleryLayoutOptionLabel}>{label}</span>
      </div>
    </button>
  )
}

export default GalleryLayoutOption
