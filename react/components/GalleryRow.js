import React, { memo } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import classNames from 'classnames'

import GalleryItem from './GalleryItem'

const CSS_HANDLES = ['galleryItem']

const GalleryRow = ({ products, summary, displayMode, itemsPerRow }) => {
  const handles = useCssHandles(CSS_HANDLES)

  const style = {
    flexBasis: `${100 / itemsPerRow}%`,
    maxWidth: `${100 / itemsPerRow}%`,
  }
  return products.map(product => {
    return (
      <div
        key={product.productId}
        style={style}
        className={classNames(handles.galleryItem, 'pa4')}
      >
        <GalleryItem
          item={product}
          summary={summary}
          displayMode={displayMode}
        />
      </div>
    )
  })
}

export default memo(GalleryRow)
