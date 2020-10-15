declare module 'vtex.product-list-context*' {
  export const useProductImpression: () => void

  interface ProviderProps {
    listName: string
  }

  interface ProductListContext {
    ProductListProvider: ComponentType<ProviderProps>
  }

  export const ProductListContext: ProductListContext
}
