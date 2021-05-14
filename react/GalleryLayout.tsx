import React, { useContext, useEffect, useMemo } from 'react'
import type { ComponentType } from 'react'
import classNames from 'classnames'
import { ProductListContext } from 'vtex.product-list-context'
import { Spinner } from 'vtex.styleguide'
import { useCssHandles, applyModifiers } from 'vtex.css-handles'
import { useResponsiveValue } from 'vtex.responsive-values'
import type { MaybeResponsiveInput } from 'vtex.responsive-values'
import { useRuntime } from 'vtex.render-runtime'
import { SearchPageContext } from 'vtex.search-page-context'

import GalleryLayoutRow from './components/GalleryLayoutRow'
import SettingsContext from './components/SettingsContext'
import ProductListEventCaller from './utils/ProductListEventCaller'
import type { Product } from './Gallery'
import {
  SET_GALLERY_LAYOUTS_TYPE,
  SWITCH_GALLERY_LAYOUT_TYPE,
} from './constants'
import { useBreadcrumb } from './hooks/useBreadcrumb'
import { useSearchTitle } from './hooks/useSearchTitle'

const LAZY_RENDER_THRESHOLD = 2

const CSS_HANDLES = ['gallery'] as const

const { ProductListProvider } = ProductListContext
const { useSearchPageState, useSearchPageStateDispatch } = SearchPageContext

interface LayoutOption {
  name: string
  component: string
  itemsPerRow: MaybeResponsiveInput<number>
}

export type Slots = Record<string, ComponentType>

export interface GalleryLayoutProps {
  layouts: LayoutOption[]
  lazyItemsRemaining: number
  products: Product[]
  showingFacets: boolean
  summary: unknown
  slots: Slots
}

const GalleryLayout: React.FC<GalleryLayoutProps> = ({
  layouts,
  lazyItemsRemaining,
  products,
  showingFacets,
  summary,
  slots,
}) => {
  const { trackingId } = useContext(SettingsContext) || {}
  const handles = useCssHandles(CSS_HANDLES)
  const { getSettings } = useRuntime()
  const { selectedGalleryLayout } = useSearchPageState()
  const searchPageStateDispatch = useSearchPageStateDispatch()

  const breadcrumb = useBreadcrumb()
  const searchTitle = useSearchTitle(breadcrumb ?? []).trim()

  // Not using ?? operator because trackingId and searchTitle can be ''
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const listName = trackingId || searchTitle || 'Search result'

  useEffect(() => {
    searchPageStateDispatch({
      type: SET_GALLERY_LAYOUTS_TYPE,
      args: { galleryLayouts: layouts },
    })
  }, [layouts, searchPageStateDispatch])

  const currentLayoutOption = useMemo(() => {
    let layoutOption

    if (selectedGalleryLayout) {
      layoutOption = layouts.find(
        (layout) => layout.name === selectedGalleryLayout
      )
    } else {
      console.error(
        'No default gallery layout defined. Set it in search-result-layout by using the defaultGalleryLayout prop.'
      )
    }

    if (!layoutOption) {
      layoutOption = layouts[0]

      searchPageStateDispatch({
        type: SWITCH_GALLERY_LAYOUT_TYPE,
        args: {
          selectedGalleryLayout: layouts[0].name,
          focus: false,
        },
      })
    }

    return layoutOption
  }, [selectedGalleryLayout, layouts, searchPageStateDispatch])

  const itemsPerRow = useResponsiveValue(currentLayoutOption.itemsPerRow)

  const galleryRows = useMemo(() => {
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

  if (!slots[currentLayoutOption.component]) {
    console.error(
      `Define a Slot with name "${currentLayoutOption.component}" for the layout "${currentLayoutOption.name}".`
    )

    return null
  }

  const galleryClasses = classNames(
    applyModifiers(handles.gallery, currentLayoutOption.name),
    'flex flex-row flex-wrap items-stretch bn ph1 na4',
    {
      'justify-center': !showingFacets,
      'pl9-l': showingFacets,
    }
  )

  const isLazyRenderEnabled = getSettings('vtex.store')
    ?.enableSearchRenderingOptimization

  return (
    <ProductListProvider listName={listName as string}>
      <div id="gallery-layout-container" className={galleryClasses}>
        {galleryRows.map((rowProducts, index) => (
          <GalleryLayoutRow
            key={`${currentLayoutOption.name}-${index}`}
            products={rowProducts}
            lazyRender={!!isLazyRenderEnabled && index >= LAZY_RENDER_THRESHOLD}
            summary={summary}
            displayMode="normal"
            itemsPerRow={itemsPerRow}
            currentLayoutName={currentLayoutOption.name}
            rowIndex={index}
            listName={listName}
            GalleryItemComponent={slots[currentLayoutOption.component]}
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
