import { ComponentType } from 'react'
import { MaybeResponsiveInput } from 'vtex.responsive-values'

declare global {
  interface GalleryLegacyProps {
    lazyItemsRemaining: number
    maxItemsPerRow: number
    minItemWidth: number
    mobileLayoutMode: MobileLayoutMode
    products: Product[]
    showingFacets: boolean
    summary: unknown
  }
  type MobileLayoutMode = 'normal' | 'small' | 'inline'

  interface LayoutOption {
    name: string
    component: string
    itemsPerRow: MaybeResponsiveInput<number>
  }

  type Slots = Record<string, ComponentType>

  interface GalleryLayoutProps {
    layouts: LayoutOption[]
    lazyItemsRemaining: number
    products: Product[]
    showingFacets: boolean
    summary: unknown
    slots: Slots
  }

  /*
   * This type receives Slots directly, instead of using the 'slots' prop to do it.
   * Is the equivalent of adding '[key: string]: ComponentType' at the end of GalleryLayoutProps
   * and removing the 'slots' prop.
   */
  type GalleryLayoutPropsWithSlots = Omit<GalleryLayoutProps, 'slots'> & Slots

  interface GalleryLayoutRowProps {
    displayMode: string
    GalleryItemComponent: ComponentType
    itemsPerRow: number
    lazyRender: boolean
    products: Product[]
    summary: unknown
  }

  interface GalleryLayoutItemProps {
    GalleryItemComponent: ComponentType<any>
    item: Product
    displayMode: string
    summary: unknown
  }

  interface Product {
    /** Product's id. */
    productId: string
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

  interface OptionSlot {
    isActive?: boolean
  }

  interface GalleryLayoutOptionProps {
    Option: ComponentType<OptionSlot>
    name: string
  }
}
