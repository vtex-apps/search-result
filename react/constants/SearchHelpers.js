import { useContext } from 'react'
import SettingsContext from '../components/SettingsContext'

export function getFilterTitle(title = '', intl) {
  return intl.messages[title] ? intl.formatMessage({ id: title }) : title
}

export function sortFacets(facets, orderFacetsBy) {
  switch (orderFacetsBy) {
    case 'QuantityDESC':
      return facets.sort((a, b) => b.quantity - a.quantity)
    case 'QuantityASC':
      return facets.sort((a, b) => a.quantity - b.quantity)
    case 'NameASC':
      return facets.sort((a, b) => (a.name > b.name ? 1 : -1))
    case 'NameDESC':
      return facets.sort((a, b) => (a.name > b.name ? -1 : 1))
    default:
      return facets
  }
}

export function filterFacetsByName(facets, name) {
  if (!name || name === '') {
    return facets
  }

  return facets.filter(facet => facet.name.toLowerCase().indexOf(name) > -1)
}

export function useSettings() {
  return useContext(SettingsContext)
}

export const HEADER_SCROLL_OFFSET = 90
