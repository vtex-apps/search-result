import React, { memo } from 'react'
import type { ComponentType } from 'react'
import { useCssHandles, applyModifiers } from 'vtex.css-handles'
import classNames from 'classnames'

import { useRenderOnView } from '../hooks/useRenderOnView'
import GalleryItem from './GalleryItem'
import type { Product } from '../Gallery'
import type { MobileLayoutMode } from '../GalleryLegacy'

const CSS_HANDLES = ['galleryItem'] as const

interface GalleryRowProps {
  products: Product[]
  /**
   * Apparently this is a dead prop and should as I could not find any scenario where the runtime passes it down or
   * even a case where product summary uses it. Therefore I will leave it as :any
   */
  summary: any
  displayMode: MobileLayoutMode
  itemsPerRow: number
  lazyRender?: boolean
  rowIndex?: number
  listName: string
  customSummaryInterval?: number
  CustomSummary?: ComponentType
}

function GalleryRow({
  products,
  summary,
  displayMode,
  itemsPerRow,
  lazyRender,
  rowIndex = 0,
  listName,
  customSummaryInterval,
  CustomSummary,
}: GalleryRowProps) {
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

        const shouldRenderCustom = !!(
          CustomSummary &&
          customSummaryInterval &&
          absoluteProductIndex % customSummaryInterval === 0
        )

        return (
          <div
            key={product.cacheId}
            style={style}
            className={classNames(
              applyModifiers(handles.galleryItem, [
                displayMode,
                shouldRenderCustom ? 'custom' : '',
              ]),
              'pa4'
            )}
          >
            <GalleryItem
              item={product}
              summary={summary}
              displayMode={displayMode}
              position={absoluteProductIndex}
              listName={listName}
              CustomSummary={shouldRenderCustom ? CustomSummary : undefined}
            />
          </div>
        )
      })}
    </>
  )
}

export default memo(GalleryRow)
