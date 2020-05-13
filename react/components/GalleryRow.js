import React, { useRef, useEffect, memo } from 'react'
import { useInView } from 'react-intersection-observer'
import { usePixel } from 'vtex.pixel-manager/PixelContext'
import { useCssHandles } from 'vtex.css-handles'
import classNames from 'classnames'

import GalleryItem from './GalleryItem'

const CSS_HANDLES = ['galleryItem']

const GalleryRow = ({
  products,
  summary,
  displayMode,
  itemsPerRow,
  ProductSummary,
}) => {
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
          ProductSummary={ProductSummary}
        />
      </div>
    )
  })
}

export default memo(GalleryRow)
