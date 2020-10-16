import React from 'react'
import classNames from 'classnames'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = ['galleryLayoutSwitcher'] as const

const GalleryLayoutSwitcher: React.FC = ({ children }) => {
  const handles = useCssHandles(CSS_HANDLES)

  const gallerySwitcherClasses = classNames(
    handles.galleryLayoutSwitcher,
    'flex flex-row flex-wrap items-stretch bn ph1 na4'
  )

  return <div className={gallerySwitcherClasses}>{children}</div>
}

export default GalleryLayoutSwitcher
