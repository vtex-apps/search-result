import React, { useContext, useEffect, useMemo } from 'react'
import type { ComponentType } from 'react'
import classNames from 'classnames'
import { ProductListContext } from 'vtex.product-list-context'
import { useCssHandles, applyModifiers } from 'vtex.css-handles'
import { useResponsiveValue } from 'vtex.responsive-values'
import type { MaybeResponsiveInput } from 'vtex.responsive-values'
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
  products: Product[]
  showingFacets: boolean
  summary: unknown
  /** Logic to enable which SKU will be the selected item */
  preferredSKU?: PreferredSKU
  slots: Slots
}

export type PreferredSKU =
  | 'FIRST_AVAILABLE'
  | 'LAST_AVAILABLE'
  | 'PRICE_ASC'
  | 'PRICE_DESC'

const GalleryLayout: React.FC<GalleryLayoutProps> = ({
  layouts,
  products,
  showingFacets,
  summary,
  preferredSKU,
  slots,
}) => {
  const { trackingId } = useContext(SettingsContext) || {}
  const handles = useCssHandles(CSS_HANDLES)
  const { selectedGalleryLayout } = useSearchPageState()
  const searchPageStateDispatch = useSearchPageStateDispatch()

  const breadcrumb = useBreadcrumb()
  const searchTitle = useSearchTitle(breadcrumb ?? [], { matchFt: true }).trim()

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
        layout => layout.name === selectedGalleryLayout
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

  return (
    <ProductListProvider listName={listName as string}>
      <div id="gallery-layout-container" className={galleryClasses}>
        {galleryRows.map((rowProducts, index) => (
          <GalleryLayoutRow
            key={`${currentLayoutOption.name}-${index}`}
            products={rowProducts}
            summary={summary}
            displayMode="normal"
            itemsPerRow={itemsPerRow}
            currentLayoutName={currentLayoutOption.name}
            rowIndex={index}
            listName={listName}
            preferredSKU={preferredSKU}
            GalleryItemComponent={slots[currentLayoutOption.component]}
          />
        ))}
      </div>
      <ProductListEventCaller />
    </ProductListProvider>
  )
}

export default GalleryLayout
