import React, { memo } from 'react'
import type { ComponentType } from 'react'
import { useCssHandles, applyModifiers } from 'vtex.css-handles'
import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'
import classNames from 'classnames'

import { useRenderOnView } from '../hooks/useRenderOnView'
import GalleryItem from './GalleryItem'
import type { Product } from '../Gallery'
import type { MobileLayoutMode } from '../GalleryLegacy'
import type { PreferredSKU } from '../GalleryLayout'

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
  /** Logic to enable which SKU will be the selected item */
  preferredSKU?: PreferredSKU
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
  preferredSKU,
}: GalleryRowProps) {
  const { searchQuery } = useSearchPage()
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

  const { searchId, redirect } = searchQuery?.data?.productSearch || {}

  return (
    <>
      {products.map((product, index) => {
        const absoluteProductIndex = rowIndex * itemsPerRow + index + 1

        const shouldRenderCustom = !!(
          CustomSummary &&
          customSummaryInterval &&
          absoluteProductIndex % customSummaryInterval === 0
        )

        const shouldAddAFAttr = searchId && !redirect && product.productId

        return (
          <div
            data-af-element={shouldAddAFAttr ? 'search-result' : undefined}
            data-af-onclick={shouldAddAFAttr ? true : undefined}
            data-af-search-id={shouldAddAFAttr ? searchId : undefined}
            data-af-product-position={
              shouldAddAFAttr ? absoluteProductIndex : undefined
            }
            data-af-product-id={shouldAddAFAttr ? product.productId : undefined}
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
              preferredSKU={preferredSKU}
            />
          </div>
        )
      })}
    </>
  )
}

export default memo(GalleryRow)
