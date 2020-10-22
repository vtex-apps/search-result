import React, { ComponentType, memo } from 'react'
import { useRenderOnView } from '../hooks/useRenderOnView'
import { useCssHandles, applyModifiers } from 'vtex.css-handles'
import classNames from 'classnames'

import GalleryItem from './GalleryLayoutItem'
import type { Product } from '../Gallery'

const CSS_HANDLES = ['galleryItem'] as const

interface GalleryLayoutRowProps {
  displayMode: string
  GalleryItemComponent: ComponentType
  itemsPerRow: number
  lazyRender: boolean
  products: Product[]
  summary: unknown
}

const GalleryLayoutRow: React.FC<GalleryLayoutRowProps> = ({
  GalleryItemComponent,
  displayMode,
  itemsPerRow,
  lazyRender,
  products,
  summary,
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

  return (
    <>
      {products.map((product) => {
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
              GalleryItemComponent={GalleryItemComponent}
              item={product}
              summary={summary}
              displayMode={displayMode}
            />
          </div>
        )
      })}
    </>
  )
}

export default memo(GalleryLayoutRow)
