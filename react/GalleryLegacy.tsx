import type { ComponentType } from 'react'
import React, { useMemo, useContext } from 'react'
import classNames from 'classnames'
// eslint-disable-next-line no-restricted-imports
import { splitEvery } from 'ramda'
import { useDevice } from 'vtex.device-detector'
import { ProductListContext } from 'vtex.product-list-context'
import { useResponsiveValue } from 'vtex.responsive-values'
import { useCssHandles } from 'vtex.css-handles'
import { useRuntime } from 'vtex.render-runtime'
import { Spinner } from 'vtex.styleguide'
import type { MaybeResponsiveInput } from 'vtex.responsive-values'

import withResizeDetector from './components/withResizeDetector'
import GalleryRow from './components/GalleryRow'
import ProductListEventCaller from './utils/ProductListEventCaller'
import SettingsContext from './components/SettingsContext'
import type { Product } from './Gallery'
import { useBreadcrumb } from './hooks/useBreadcrumb'
import { useSearchTitle } from './hooks/useSearchTitle'

/** Layout with one column */
const ONE_COLUMN_LAYOUT = 1

const LAZY_RENDER_THRESHOLD = 2

const CSS_HANDLES = ['gallery'] as const

const { ProductListProvider } = ProductListContext

export type MobileLayoutMode = 'normal' | 'small' | 'inline'

export interface GalleryProps {
  products: Product[]
  mobileLayoutMode: MobileLayoutMode
  maxItemsPerRow: MaybeResponsiveInput<number>
  minItemWidth: number
  width: number
  summary: any
  showingFacets: any
  lazyItemsRemaining: number
  customSummaryInterval?: number
  CustomSummary?: ComponentType
}

/**
 * Canonical gallery that displays a list of given products.
 */
const Gallery: React.FC<GalleryProps> = ({
  products = [],
  mobileLayoutMode = 'normal',
  maxItemsPerRow = {
    desktop: 5,
    tablet: 3,
    phone: 2,
  },
  minItemWidth = 240,
  width,
  summary,
  showingFacets,
  lazyItemsRemaining,
  customSummaryInterval,
  CustomSummary,
}) => {
  const { isMobile } = useDevice()
  const { trackingId } = useContext(SettingsContext) || {}
  const handles = useCssHandles(CSS_HANDLES)
  const { getSettings } = useRuntime()
  const responsiveMaxItemsPerRow = useResponsiveValue(maxItemsPerRow)
  const breadcrumb = useBreadcrumb()
  const searchTitle = useSearchTitle(breadcrumb ?? []).trim()

  // Not using ?? operator because trackingId and searchTitle can be ''
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const listName = trackingId || searchTitle || 'Search result'

  const layoutMode = isMobile ? mobileLayoutMode : 'normal'

  const getItemsPerRow = () => {
    const maxItemsPerMinWidth = Math.floor(width / minItemWidth)

    if (isMobile) {
      if (layoutMode === 'normal') {
        return ONE_COLUMN_LAYOUT
      }

      const maxItemsOnMobile =
        maxItemsPerMinWidth >= 2 ? maxItemsPerMinWidth : 2

      return responsiveMaxItemsPerRow <= maxItemsOnMobile
        ? responsiveMaxItemsPerRow
        : maxItemsOnMobile
    }

    return responsiveMaxItemsPerRow <= maxItemsPerMinWidth
      ? responsiveMaxItemsPerRow
      : maxItemsPerMinWidth
  }

  const itemsPerRow = getItemsPerRow() || responsiveMaxItemsPerRow

  const rows = useMemo(() => splitEvery(itemsPerRow, products), [
    itemsPerRow,
    products,
  ])

  const galleryClasses = classNames(
    handles.gallery,
    'flex flex-row flex-wrap items-stretch bn ph1 na4',
    {
      'justify-center': !showingFacets,
      'pl9-l': showingFacets,
    }
  )

  const isLazyRenderEnabled = getSettings('vtex.store')
    ?.enableSearchRenderingOptimization

  return (
    <ProductListProvider listName={listName}>
      <div className={galleryClasses}>
        {rows.map((rowProducts, index) => (
          <GalleryRow
            key={index}
            products={rowProducts}
            lazyRender={isLazyRenderEnabled && index >= LAZY_RENDER_THRESHOLD}
            summary={summary}
            displayMode={layoutMode}
            itemsPerRow={itemsPerRow}
            rowIndex={index}
            listName={listName}
            customSummaryInterval={customSummaryInterval}
            CustomSummary={CustomSummary}
          />
        ))}
        {typeof lazyItemsRemaining === 'number' && lazyItemsRemaining > 0 && (
          <div
            style={{
              width: '100%',
              // Approximate number, just to add scroll leeway
              height: 300 * Math.ceil(lazyItemsRemaining / itemsPerRow),
            }}
            className="flex justify-center pt10"
          >
            <Spinner />
          </div>
        )}
      </div>
      <ProductListEventCaller />
    </ProductListProvider>
  )
}

export default withResizeDetector<GalleryProps>(Gallery)
