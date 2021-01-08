import React, { ComponentType, memo } from 'react'
import { useRenderOnView } from '../hooks/useRenderOnView'
import { useCssHandles, applyModifiers } from 'vtex.css-handles'
import classNames from 'classnames'

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
        return (
          <div
            key={product.productId}
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
              position={(rowIndex * itemsPerRow) + index}
            />
          </div>
        )
      })}
    </>
  )
}

export default memo(GalleryLayoutRow)
