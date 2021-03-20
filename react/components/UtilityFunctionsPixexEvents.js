export const getCategoryFromObjs = (products) => {
  if (products[0] == null || products[0] == undefined) {
    return ''
  }

  const { categoryId } = products[0]
  const result = products.every((obj) => obj.categoryId == categoryId)

  return result ? categoryId : ''
}

export const pushPixelEvent = (name, value, isSelected, products, push) => {
  if (isSelected) {
    push({
      event: 'filterManipulation',
      items: {
        filterProductCategory: getCategoryFromObjs(products),
        filterName: name,
        filterValue: value,
      },
    })
  }
}
