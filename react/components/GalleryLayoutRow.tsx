import type { ComponentType } from 'react'
import React, { memo } from 'react'
import { useCssHandles, applyModifiers } from 'vtex.css-handles'
import classNames from 'classnames'

import { useRenderOnView } from '../hooks/useRenderOnView'
import GalleryItem from './GalleryLayoutItem'
import type { Product } from '../Gallery'

const CSS_HANDLES = ['galleryItem'] as const

interface GalleryLayoutRowProps {
  currentLayoutName: string
  displayMode: string
  GalleryItemComponent: ComponentType
  itemsPerRow: number
  lazyRender: boolean
  products: Product[]
  summary: unknown
  rowIndex: number
  listName: string
}

const GalleryLayoutRow: React.FC<GalleryLayoutRowProps> = ({
  GalleryItemComponent,
  displayMode,
  itemsPerRow,
  lazyRender,
  products,
  summary,
  currentLayoutName,
  rowIndex,
  listName,
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
      {products.map((product, index) => {
        const absoluteProductIndex = rowIndex * itemsPerRow + index + 1
        return (
          <div
            key={product.cacheId}
            style={style}
            className={classNames(
              applyModifiers(handles.galleryItem, [
                displayMode,
                currentLayoutName,
              ]),
              'pa4'
            )}
          >
            <GalleryItem
              GalleryItemComponent={GalleryItemComponent}
              item={product}
              summary={summary}
              displayMode={displayMode}
              position={absoluteProductIndex}
              listName={listName}
            />
          </div>
        )
      })}
    </>
  )
}

export default memo(GalleryLayoutRow)
