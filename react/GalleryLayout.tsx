import React, { ComponentType, useContext, useMemo } from 'react'
import classNames from 'classnames'

import { ProductListContext } from 'vtex.product-list-context'
import { Spinner } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'
import {
  useResponsiveValue,
  MaybeResponsiveInput,
} from 'vtex.responsive-values'
import { useRuntime } from 'vtex.render-runtime'
import { useSearchPageState } from 'vtex.search-page-context/SearchPageContext'

import GalleryLayoutRow from './components/GalleryLayoutRow'
import SettingsContext from './components/SettingsContext'
import ProductListEventCaller from './utils/ProductListEventCaller'

export interface LayoutDescription {
  name: string
  component: string
  itemsPerRow: MaybeResponsiveInput<number>
}

export type Slots = Record<string, ComponentType>

export interface GalleryLayoutProps {
  layouts: LayoutDescription[]
  lazyItemsRemaining: number
  products: any[]
  showingFacets: boolean
  summary: any
  slots: Slots
}

export type GalleryLayoutPropsWithSlots = Omit<GalleryLayoutProps, 'slots'> &
  Slots

const LAZY_RENDER_THRESHOLD = 2

const CSS_HANDLES = ['gallery']

const { ProductListProvider } = ProductListContext

const GalleryLayout: React.FC<GalleryLayoutProps> = ({
  layouts,
  lazyItemsRemaining,
  products,
  showingFacets,
  summary,
  slots,
}) => {
  const { trackingId = 'Search result' } = useContext(SettingsContext) || {}
  const handles = useCssHandles(CSS_HANDLES)
  const { getSettings } = useRuntime()
  const { galleryLayout } = useSearchPageState()

  const currentLayoutDescription = useMemo(() => {
    let layoutDescription

    if (galleryLayout) {
      layoutDescription = layouts.find(layout => layout.name === galleryLayout)
    }

    return layoutDescription ?? layouts[0]
  }, [galleryLayout, layouts])

  const itemsPerRow = useResponsiveValue(currentLayoutDescription.itemsPerRow)

  const rows = useMemo(() => {
    const rows = []

    let i = 0

    while (i * itemsPerRow < products.length) {
      const start = i * itemsPerRow
      const end = (i + 1) * itemsPerRow

      rows.push(products.slice(start, end))
      i++
    }

    return rows
  }, [itemsPerRow, products])

  if (!layouts || layouts.length === 0) {
    return null
  }

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
    <ProductListProvider listName={trackingId}>
      <div className={galleryClasses}>
        {rows.map((rowProducts, index) => (
          <GalleryLayoutRow
            key={index.toString()}
            products={rowProducts}
            lazyRender={!!isLazyRenderEnabled && index >= LAZY_RENDER_THRESHOLD}
            summary={summary}
            displayMode={'normal'}
            itemsPerRow={itemsPerRow}
            GalleryItemComponent={slots[currentLayoutDescription.component]}
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

export default GalleryLayout
