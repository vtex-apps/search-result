/**
 * Types of radio filters available in the application
 */
const RADIO_FILTER_TYPES = {
  SHIPPING: 'shipping',
  DELIVERY_OPTIONS: 'delivery-options',
}

/**
 * Types of toggle filters available in the application
 */
const TOGGLE_FILTER_TYPES = {
  DYNAMIC_ESTIMATE: 'dynamic-estimate',
}

/**
 * Checks if a filter key corresponds to a radio filter type
 * @param {string} key - Filter key to check
 * @returns {boolean} True if the key belongs to a radio filter type
 */
export const isRadioFilter = (key: string): boolean =>
  Object.values(RADIO_FILTER_TYPES).includes(key)

/**
 * Checks if a filter key corresponds to a toggle filter type
 * @param {string} key - Filter key to check
 * @returns {boolean} True if the key belongs to a toggle filter type
 */
export const isToggleFilter = (key: string): boolean =>
  Object.values(TOGGLE_FILTER_TYPES).includes(key)

export const isSingleOptionFilter = (key: string): boolean =>
  [
    ...Object.values(RADIO_FILTER_TYPES),
    ...Object.values(TOGGLE_FILTER_TYPES),
  ].includes(key)

export default RADIO_FILTER_TYPES
