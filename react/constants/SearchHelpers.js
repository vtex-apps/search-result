import {
  CATEGORIES_TYPE,
  BRANDS_TYPE,
  PRICE_RANGES_TYPE,
} from '../FilterNavigator'

export function getMapByType(type) {
  switch (type) {
    case PRICE_RANGES_TYPE:
      return 'priceFrom'
    case CATEGORIES_TYPE:
      return 'c'
    case BRANDS_TYPE:
      return 'b'
  }
}

export function getFilterTitle(title = '', intl) {
  return intl.messages[title] ? intl.formatMessage({ id: title }) : title
}

export const HEADER_SCROLL_OFFSET = 90
