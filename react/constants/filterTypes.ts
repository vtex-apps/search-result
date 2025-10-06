/**
 * Types of radio filters available in the application
 */
const RADIO_FILTER_TYPES = {
  SHIPPING: 'shipping',
  DELIVERY_OPTIONS: 'delivery-options',
}

/**
 * Checks if a filter key corresponds to a radio filter type
 * @param {string} key - Filter key to check
 * @returns {boolean} True if the key belongs to a radio filter type
 */
export const isRadioFilter = (key: string): boolean =>
  Object.values(RADIO_FILTER_TYPES).includes(key)

export default RADIO_FILTER_TYPES
