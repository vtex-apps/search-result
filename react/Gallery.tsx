import React from 'react'
import GalleryLayout from './GalleryLayout'
import type { GalleryLayoutProps, Slots } from './GalleryLayout'
//@ts-ignore
import GalleryLegacy, {
  GalleryProps as GalleryLegacyProps,
} from './GalleryLegacy'

/*
 * This type receives Slots directly, instead of using the 'slots' prop to do it.
 * Is the equivalent of adding '[key: string]: ComponentType' at the end of GalleryLayoutProps
 * and removing the 'slots' prop.
 */
type GalleryLayoutPropsWithSlots = Omit<GalleryLayoutProps, 'slots'> & Slots

const Gallery: React.FC<GalleryLegacyProps | GalleryLayoutPropsWithSlots> = (
  props
) => {
  if ('layouts' in props && props.layouts.length > 0) {
    const {
      layouts,
      lazyItemsRemaining,
      products,
      showingFacets,
      summary,
      ...slots
    } = props as GalleryLayoutPropsWithSlots

    return (
      <GalleryLayout
        layouts={layouts}
        lazyItemsRemaining={lazyItemsRemaining}
        products={products}
        showingFacets={showingFacets}
        summary={summary}
        slots={slots}
      />
    )
  }

  return <GalleryLegacy {...(props as GalleryLegacyProps)} />
}

export interface Product {
  /** Product's id. */
  productId: string
  /** Product's cache id. */
  cacheId: string
  /** Product's name. */
  productName: string
  /** Product's description. */
  description: string
  /** Product's categories. */
  categories: unknown[]
  /** Product's link. */
  link?: string
  /** Product's link text. */
  linkText: string
  /** Product's brand. */
  brand?: string
  /** Product's SKU items. */
  items: ProductItem[]
}

interface ProductItemReference {
  Value: string
}

interface ProductItemImage {
  /** Images's imageUrl. */
  imageUrl: string
  /** Images's imageTag. */
  imageTag: string
}

interface ProductItemSeller {
  /** Sellers's commertialOffer. */
  commertialOffer: {
    /** CommertialOffer's price. */
    Price: number
    /** CommertialOffer's list price. */
    ListPrice: number
  }
}

interface ProductItem {
  /** SKU's id. */
  itemId: string
  /** SKU's name. */
  name: string
  /** SKU's referenceId. */
  referenceId?: ProductItemReference[]
  /** SKU's images. */
  images: ProductItemImage[]
  /** SKU's sellers. */
  sellers: ProductItemSeller[]
}

export default Gallery
