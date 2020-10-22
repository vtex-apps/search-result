import React, { ComponentType } from 'react'

import { useCssHandles } from 'vtex.css-handles'
import { SearchPageContext } from 'vtex.search-page-context'
import { SWITCH_GALLERY_LAYOUT_TYPE } from './constants'

const CSS_HANDLES = ['galleryLayoutOption'] as const
const { useSearchPageState, useSearchPageStateDispatch } = SearchPageContext

interface OptionSlot {
  isActive?: boolean
}

interface GalleryLayoutOptionProps {
  Option: ComponentType<OptionSlot>
  name: string
}

const GalleryLayoutOption: React.FC<GalleryLayoutOptionProps> = ({
  Option,
  name,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  const { galleryLayout } = useSearchPageState()
  const dispatch = useSearchPageStateDispatch()

  const isActive = name === galleryLayout

  const handleOptionClick = () => {
    dispatch({
      type: SWITCH_GALLERY_LAYOUT_TYPE,
      args: { galleryLayout: name },
    })
  }

  return (
    <button
      className={`${handles.galleryLayoutOption} grow dib br-100 pa2 mr2 ml2 bw0 pointer outline-0 bg-transparent`}
      onClick={handleOptionClick}
      role="radio"
      aria-checked={isActive}
      aria-controls="gallery-layout-container"
      aria-label={`Switch to ${name} layout`}
    >
      <Option isActive={isActive} />
    </button>
  )
}

export default GalleryLayoutOption
