import { createContext, useContext } from 'react'

const ProductsPositionOffsetContext = createContext(0)

export const ProductsPositionOffsetProvider =
  ProductsPositionOffsetContext.Provider

export function useProductsPositionOffset(): number {
  return useContext(ProductsPositionOffsetContext)
}

export default ProductsPositionOffsetContext
