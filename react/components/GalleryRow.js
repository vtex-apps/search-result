import React, { memo } from 'react'
import { useRenderOnView } from '../hooks/useRenderOnView'
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
  preloadFirstImage,
}) => {
  const handles = useCssHandles(CSS_HANDLES)

  const style = {
    flexBasis: `${100 / itemsPerRow}%`,
    maxWidth: `${100 / itemsPerRow}%`,
  }

  const { hasBeenViewed, dummyElement } = useRenderOnView({
    lazyRender,
    offset: 900,
  })

  if (!hasBeenViewed) {
    return dummyElement
  }

  return products.map((product, i) => {
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
          preload={preloadFirstImage && i === 0}
        />
      </div>
    )
  })
}

export default memo(GalleryRow)
