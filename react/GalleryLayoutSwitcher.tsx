import React, { useCallback } from 'react'
import classNames from 'classnames'
import { useCssHandles } from 'vtex.css-handles'
import { SearchPageContext } from 'vtex.search-page-context'

const { useSearchPageState, useSearchPageStateDispatch } = SearchPageContext

const CSS_HANDLES = ['galleryLayoutSwitcher'] as const

const GalleryLayoutSwitcher: React.FC = ({ children }) => {
  const handles = useCssHandles(CSS_HANDLES)
  const {
    selectedGalleryLayout,
    focusedGalleryLayout,
    galleryLayouts,
  } = useSearchPageState()
  const dispatch = useSearchPageStateDispatch()

  const gallerySwitcherClasses = classNames(
    handles.galleryLayoutSwitcher,
    'flex flex-row bn'
  )

  const navigateWithKeys = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (
        !galleryLayouts ||
        !(
          e.key === 'ArrowLeft' ||
          e.key === 'ArrowUp' ||
          e.key === 'ArrowRight' ||
          e.key === 'ArrowDown'
        )
      ) {
        return
      }

      const currentFocusedIndex = galleryLayouts.findIndex(
        (layout) =>
          layout.name === (focusedGalleryLayout ?? selectedGalleryLayout)
      )

      if (currentFocusedIndex === -1) {
        console.error(
          `No layout defined with name ${focusedGalleryLayout}. Check if there are unnecessary layout options with this name.`
        )
      }

      let newFocusedLayoutIndex = 0

      /**
       * - ArrowLeft moves the focus to the left until it reaches the beginning
       * - ArrowRight moves the focus to the right until it reaches the end
       * - ArrowUp loops through the items by moving the focus to the left,
       *   going to the end when it reaches the beginning
       * - ArrowDown loops through the items by moving the focus to the right,
       *   going to the beginning when it reaches the end
       */
      if (e.key === 'ArrowLeft') {
        newFocusedLayoutIndex = Math.max(0, currentFocusedIndex - 1)
      } else if (e.key === 'ArrowRight') {
        newFocusedLayoutIndex = Math.min(
          currentFocusedIndex + 1,
          galleryLayouts.length - 1
        )
      } else if (e.key === 'ArrowUp') {
        newFocusedLayoutIndex =
          (currentFocusedIndex - 1) % galleryLayouts.length

        if (newFocusedLayoutIndex < 0) {
          newFocusedLayoutIndex = galleryLayouts.length - 1
        }
      } else if (e.key === 'ArrowDown') {
        newFocusedLayoutIndex =
          (currentFocusedIndex + 1) % galleryLayouts.length
      }

      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
      }

      dispatch({
        type: 'SET_FOCUS_GALLERY_LAYOUT',
        args: {
          focusedGalleryLayout: galleryLayouts[newFocusedLayoutIndex].name,
        },
      })
    },
    [selectedGalleryLayout, focusedGalleryLayout, galleryLayouts]
  )

  return (
    <div
      className={gallerySwitcherClasses}
      role="radiogroup"
      aria-label="Search result layout"
      onKeyDown={navigateWithKeys}
    >
      {children}
    </div>
  )
}

export default GalleryLayoutSwitcher
