function sortByName(a, b, asc) {
  const index = asc ? -1 : 1

  if (a.productName < b.productName) {
    return 1 * index
  }
  if (a.productName > b.productName) {
    return -1 * index
  }

  return 0
}

function sortByPrice(a, b, asc) {
  const index = asc ? -1 : 1
  const aPrice = a.items[0].sellers[0].commertialOffer.Price
  const bPrice = b.items[0].sellers[0].commertialOffer.Price

  if (aPrice < bPrice) {
    return 1 * index
  }
  if (aPrice > bPrice) {
    return -1 * index
  }

  return 0
}

export function sortProducts(products, sortValue) {
  let sortFunction
  let asc

  switch (sortValue) {
    case 'sortBy.lowerPrice':
      sortFunction = sortByPrice
      asc = true
      break
    case 'sortBy.higherPrice':
      sortFunction = sortByPrice
      asc = false
      break
    case 'sortBy.nameAZ':
      sortFunction = sortByName
      asc = true
      break
    case 'sortBy.nameZA':
      sortFunction = sortByName
      asc = false
      break
    default:
      sortFunction = sortByPrice
      asc = false
      break
  }

  return [...products].sort((a, b) => sortFunction(a, b, asc))
}
