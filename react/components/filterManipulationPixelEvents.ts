const getCategoryFromObjs = (products: Array<Record<string, unknown>>) => {
  if (products[0] === null || products[0] === undefined) {
    return ''
  }

  const { categoryId } = products[0]
  const result = products.every(
    (product: Record<string, unknown>) => product.categoryId === categoryId
  )

  return result ? categoryId : ''
}

export const pushPixelEvent = (
  name: string,
  value: unknown,
  products: Array<Record<string, unknown>>,
  push: (arg0: {
    event: string
    items: {
      filterProductCategory: unknown
      filterName: string
      filterValue: unknown
    }
  }) => void
) => {
  push({
    event: 'filterManipulation',
    items: {
      filterProductCategory: getCategoryFromObjs(products),
      filterName: name,
      filterValue: value,
    },
  })
}
