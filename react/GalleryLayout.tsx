import React, { ComponentType, useContext, useMemo } from 'react'
import classNames from 'classnames'
import { splitEvery } from 'ramda'

import { ProductListContext } from 'vtex.product-list-context'
import { Spinner } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'
import { useResponsiveValue } from 'vtex.responsive-values'
import { useRuntime } from 'vtex.render-runtime'
import { useSearchPageState } from 'vtex.search-page-context/SearchPageContext'

import GalleryRow from './GalleryLayoutRow'
import SettingsContext from './components/SettingsContext'
import ProductListEventCaller from './utils/ProductListEventCaller'

interface LayoutDescription {
  name: string
  component: string
  itemPerRow?: number
  itemsPerRow?: Record<string, number>
}

interface Slots {
  [key: string]: ComponentType
}

export interface GalleryLayoutProps {
  layouts: LayoutDescription[]
  lazyItemsRemaining: number
  products: any[]
  showingFacets: boolean
  summary: any
}

const LAZY_RENDER_THRESHOLD = 2

const CSS_HANDLES = ['gallery']

const { ProductListProvider } = ProductListContext

const GalleryLayout: React.FC<GalleryLayoutProps & Slots> = ({
  layouts,
  lazyItemsRemaining,
  products,
  showingFacets,
  summary,
  ...props
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

  const itemsPerRow = useResponsiveValue(
    currentLayoutDescription.itemPerRow ?? currentLayoutDescription.itemsPerRow
  ) as number

  /*
  const itemsPerRow = useMemo(() => {
    if (currentLayoutDescription.itemPerRow) {
      return currentLayoutDescription.itemPerRow
    }

    if (currentLayoutDescription.itemsPerRow) {
      const sortedItemsPerRow = Object.keys(
        currentLayoutDescription.itemsPerRow
      )
        .map(widthString => +widthString) //converts keys into numbers
        .sort((a, b) => a - b) // sort in ascending order

      //finds the appropriate desired width for the width available
      let appropriateItemsPerRow = sortedItemsPerRow.find(
        desiredWidth => width <= desiredWidth
      )

      //Available width is bigger than the desired widths, sets it to the biggest
      if (!appropriateItemsPerRow) {
        appropriateItemsPerRow = sortedItemsPerRow[sortedItemsPerRow.length - 1]
      }

      return currentLayoutDescription.itemsPerRow[appropriateItemsPerRow]
    }

    return Math.floor(width / minItemWidth)
  }, [currentLayoutDescription, width, minItemWidth])
  */

  const rows = useMemo(() => splitEvery(itemsPerRow, products), [
    itemsPerRow,
    products,
  ])

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
          <GalleryRow
            key={index.toString()}
            products={rowProducts}
            lazyRender={!!isLazyRenderEnabled && index >= LAZY_RENDER_THRESHOLD}
            summary={summary}
            displayMode={'normal'}
            itemsPerRow={itemsPerRow}
            GalleryItemComponent={props[currentLayoutDescription.component]}
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
