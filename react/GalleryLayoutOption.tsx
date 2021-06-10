import React, { useEffect } from 'react'
import type { PropsWithChildren } from 'react'
import { useCssHandles, applyModifiers } from 'vtex.css-handles'
import type { RenderContext } from 'vtex.render-runtime'
import { useRuntime } from 'vtex.render-runtime'
import { SearchPageContext } from 'vtex.search-page-context'

import { SWITCH_GALLERY_LAYOUT_TYPE } from './constants'

const { useSearchPageState, useSearchPageStateDispatch } = SearchPageContext

interface GalleryLayoutOptionProps {
  /** Unique name to match with a layout name */
  name: string
}

const CSS_HANDLES = ['galleryLayoutOptionButton'] as const

function GalleryLayoutOption({
  name,
  children,
}: PropsWithChildren<GalleryLayoutOptionProps>) {
  const handles = useCssHandles(CSS_HANDLES)
  const optionButtonRef = React.useRef<HTMLButtonElement>(null)
  const { setQuery } = useRuntime() as RenderContext
  const { selectedGalleryLayout, focusedGalleryLayout } = useSearchPageState()
  const dispatch = useSearchPageStateDispatch()

  const selected = name === selectedGalleryLayout

  useEffect(() => {
    if (focusedGalleryLayout === name) {
      optionButtonRef.current?.focus()
    }
  }, [focusedGalleryLayout, name])

  const handleOptionClick = () => {
    dispatch({
      type: SWITCH_GALLERY_LAYOUT_TYPE,
      args: { selectedGalleryLayout: name },
    })

    setQuery({ layout: name })
  }

  return (
    <button
      className={`${applyModifiers(
        handles.galleryLayoutOptionButton,
        selected ? 'selected' : ''
      )} bw0 pointer bg-transparent flex flex-row items-center`}
      onClick={handleOptionClick}
      role="radio"
      aria-checked={selected}
      aria-controls="gallery-layout-container"
      aria-label={`Switch to ${name} layout`}
      tabIndex={
        (focusedGalleryLayout ?? selectedGalleryLayout) === name ? 0 : -1
      }
      ref={optionButtonRef}
    >
      {children}
    </button>
  )
}

export default GalleryLayoutOption
