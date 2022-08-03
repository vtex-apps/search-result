import React from 'react'

const ProductSummary = () => <div>ProductSummary</div>

ProductSummary.mapCatalogProductToProductSummary = product => {
  if (!product) {
    return null
  }

  const {
    items: [sku],
  } = product

  return {
    ...product,
    sku: {
      ...sku,
      seller: sku.sellers && sku.sellers[0],
      referenceId: sku.referenceId && sku.referenceId[0],
      image: sku.images && sku.images[0],
    },
  }
}

export default ProductSummary
