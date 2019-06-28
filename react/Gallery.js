import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { map, pluck, addIndex } from 'ramda'

import { useRuntime } from 'vtex.render-runtime'

import { LAYOUT_MODE } from './components/LayoutModeSwitcher'
import { productShape } from './constants/propTypes'
import GalleryItem from './components/GalleryItem'
import withResizeDetector from './components/withResizeDetector'
import { useInView } from 'react-intersection-observer'

import searchResult from './searchResult.css'
import { normalizeProduct } from './constants/productHelpers'

/** Layout with two column */
const TWO_COLUMN_ITEMS = 2

const mapWithIndex = addIndex(map)

const useProductImpression = (products, inView) => {
  const viewed = useRef(false)
  const { push } = usePixel()

  // This hook checks if the products changes, we need to send a new event
  useEffect(() => {
    if (products) {
      viewed.current = false
    }
  }, [products])

  useEffect(() => {
    if (!products || viewed.current || !inView) {
      return
    }
    const normalizedProducts = products.map(normalizeProduct)
    const impressions = normalizedProducts.map((product, index) => ({
      product,
      position: index,
    }))
    push({
      event: 'productImpression',
      list: 'Search result',
      impressions,
    })
    viewed.current = true
  }, [push, products, inView, viewed])
}

/**
 * Canonical gallery that displays a list of given products.
 */
const Gallery = ({
  products = [],
  mobileLayoutMode = LAYOUT_MODE[0].value,
  maxItemsPerRow = 5,
  minItemWidth = 240,
  width,
  summary,
  showingFacets,
}) => {
  const runtime = useRuntime()

  const layoutMode = runtime.hints.mobile ? mobileLayoutMode : 'normal'
  const [ref, inView] = useInView({
    threshold: 0.75,
  })
  useProductImpression(products, inView)

  const getItemsPerRow = () => {
    const maxItems = Math.floor(width / minItemWidth)
    return maxItemsPerRow <= maxItems ? maxItemsPerRow : maxItems
  }

  const renderItem = item => {
    const itemsPerRow =
      layoutMode === 'small'
        ? TWO_COLUMN_ITEMS
        : getItemsPerRow() || maxItemsPerRow

    const style = {
      flexBasis: `${100 / itemsPerRow}%`,
      maxWidth: `${100 / itemsPerRow}%`,
    }

    return (
      <div
        key={item.productId}
        style={style}
        className={classNames(searchResult.galleryItem, 'pa4')}
        ref={ref}
      >
        <GalleryItem item={item} summary={summary} displayMode={layoutMode} />
      </div>
    )
  }

  const galleryClasses = classNames(
    searchResult.gallery,
    'flex flex-row flex-wrap items-stretch bn ph1 na4',
    {
      'justify-center': !showingFacets,
      'pl9-l': showingFacets,
    }
  )

  return (
    <div className={galleryClasses}>{mapWithIndex(renderItem, products)}</div>
  )
}

Gallery.propTypes = {
  /** Container width */
  width: PropTypes.number,
  /** Products to be displayed. */
  products: PropTypes.arrayOf(productShape),
  /** ProductSummary props. */
  summary: PropTypes.any,
  /** Max Items per Row */
  maxItemsPerRow: PropTypes.number,
  /** Layout mode of the gallery in mobile view */
  mobileLayoutMode: PropTypes.oneOf(pluck('value', LAYOUT_MODE)),
  /** Min Item Width. */
  minItemWidth: PropTypes.number,
}

export default withResizeDetector(Gallery)
