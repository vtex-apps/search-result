export function getFilterTitle(title = '', intl) {
  return intl.messages[title] ? intl.formatMessage({ id: title }) : title
}

export const HEADER_SCROLL_OFFSET = 90
