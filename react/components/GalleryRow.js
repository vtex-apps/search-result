import React, { useRef, memo, useState } from 'react'
import { useOnView } from '../hooks/useOnView'
import { useCssHandles, applyModifiers } from 'vtex.css-handles'
import classNames from 'classnames'

import GalleryItem from './GalleryItem'

const CSS_HANDLES = ['galleryItem']

const GalleryRow = ({
  products,
  summary,
  displayMode,
  itemsPerRow,
  lazyRender,
}) => {
  const dummy = useRef()
  const handles = useCssHandles(CSS_HANDLES)
  const [hasBeenViewed, setHasBeenViewed] = useState(!lazyRender)

  const style = {
    flexBasis: `${100 / itemsPerRow}%`,
    maxWidth: `${100 / itemsPerRow}%`,
  }

  /** if lazyRender is true, only renders the actual content once "dummy"
   * is inside the viewport
   */
  useOnView({
    ref: dummy,
    onView: () => setHasBeenViewed(true),
    once: true,
    initializeOnInteraction: true,
  })

  return hasBeenViewed ? (
    products.map(product => {
      return (
        <div
          key={product.productId}
          style={style}
          className={classNames(
            applyModifiers(handles.galleryItem, displayMode),
            'pa4'
          )}
        >
          <GalleryItem
            item={product}
            summary={summary}
            displayMode={displayMode}
          />
        </div>
      )
    })
  ) : (
    <div
      ref={dummy}
      style={{
        width: '100%',
        height: 400,
        position: 'relative',
        /** Pulls the object 200px up so it renders a bit earlier,
         * before the user would actually see the content */
        top: -200,
      }}
    />
  )
}

export default memo(GalleryRow)
