export function sortByName(a, b, asc) {
  const index = asc ? 1 : -1

  if (a.productName < b.productName) {
    return 1 * index
  }
  if (a.productName > b.productName) {
    return -1 * index
  }

  return 0
}

export function sortByPrice(a, b, asc) {
  const index = asc ? 1 : -1
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
