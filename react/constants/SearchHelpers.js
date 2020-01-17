import { useCallback } from 'react'

export function getFilterTitle(title = '', intl) {
  return intl.messages[title] ? intl.formatMessage({ id: title }) : title
}

export function useSortFacets(orderFacetsBy) {
  return useCallback(
    (a, b) => {
      switch (orderFacetsBy) {
        case 'QuantityDESC':
          return b.quantity - a.quantity
        case 'QuantityASC':
          return a.quantity - b.quantity
        case 'NameASC':
          return a.name > b.name ? 1 : -1
        case 'NameDESC':
          return a.name > b.name ? -1 : 1
        default:
          return 0
      }
    },
    [orderFacetsBy]
  )
}

export const HEADER_SCROLL_OFFSET = 90
