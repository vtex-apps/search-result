const getCategoryFromObjs = (products) => {
  if (products[0] === null || products[0] === undefined) {
    return ''
  }

  const { categoryId } = products[0]
  const result = products.every((product) => product.categoryId === categoryId)

  return result ? categoryId : ''
}

const pushPixelEvent = (name, value, products, push) => {
  push({
    event: 'filterManipulation',
    items: {
      filterProductCategory: getCategoryFromObjs(products),
      filterName: name,
      filterValue: value,
    },
  })
}

export { getCategoryFromObjs, pushPixelEvent }
