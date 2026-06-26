import { path, contains, isEmpty } from 'ramda'
import { useIntl } from 'react-intl'

export const SHIPPING_TITLE = 'store/search.filter.title.shipping'
export const CATEGORIES_TITLE = 'store/search.filter.title.categories'
export const BRANDS_TITLE = 'store/search.filter.title.brands'
export const PRICE_RANGES_TITLE = 'store/search.filter.title.price-ranges'
export const DELIVERY_OPTION_TITLE =
  'store/search.filter.title.delivery-options'
export const DYNAMIC_ESTIMATE_TITLE =
  'store/search.filter.title.dynamic-estimate'

export const shippingOptions = {
  delivery: 'store/search.filter.shipping.name.delivery',
  'pickup-in-point': 'store/search.filter.shipping.name.pickup-in-point',
  'pickup-nearby': 'store/search.filter.shipping.name.pickup-nearby',
  'pickup-all': 'store/search.filter.shipping.name.pickup-all',
}

export const SHIPPING_KEY = 'shipping'
export const DYNAMIC_ESTIMATE_KEY = 'dynamic-estimate'

const DELIVERY_GROUP_TITLES = {
  [SHIPPING_KEY]: SHIPPING_TITLE,
  'delivery-options': DELIVERY_OPTION_TITLE,
  [DYNAMIC_ESTIMATE_KEY]: DYNAMIC_ESTIMATE_TITLE,
}

/** Maps a delivery group name to its heading message id; unknown groups fall back to the raw name. */
export const getDeliveryGroupTitle = name => DELIVERY_GROUP_TITLES[name] ?? name

/**
 * On desktop the dynamic-estimate group renders its options with no title and
 * no collapsible header. On mobile it keeps the regular titled, collapsible header.
 */
export const shouldHideDeliveryGroupHeader = name =>
  name === DYNAMIC_ESTIMATE_KEY

/** Delivery option facet for PLP URL after postal modal (shipping group from API). */
export function buildDeliveryShippingFacetForNavigation(deliveries, intl) {
  const shipping = deliveries?.find(d => d.name === SHIPPING_KEY)
  const raw = shipping?.facets?.find(f => f.value === 'delivery')

  if (!raw) {
    return null
  }

  return {
    ...raw,
    key: 'shipping',
    map: 'shipping',
    name: intl.formatMessage({ id: shippingOptions.delivery }),
    selected: false,
    quantity: raw.quantity ?? 1,
    title: intl.formatMessage({ id: SHIPPING_TITLE }),
  }
}

const BRANDS_TYPE = 'Brands'
const PRICE_RANGES_TYPE = 'PriceRanges'
const SPECIFICATION_FILTERS_TYPE = 'SpecificationFilters'

const defaultShippingValues = ['delivery', 'pickup-in-point', 'pickup-nearby']

/**
 * Applies the `hiddenFacets['delivery-promise']` setting to a `deliveries`
 * array, removing groups whose `name` is hidden. Supports:
 *   - `hideAll: true` — strips every delivery group.
 *   - `hiddenGroups: [{ name }]` — strips only the named groups
 *     (e.g. `shipping`, `dynamic-estimate`, `delivery-options`).
 * Falls back to the original array when the setting is absent.
 */
export const filterHiddenDeliveryGroups = (deliveries, hiddenFacets) => {
  if (!deliveries || deliveries.length === 0) {
    return deliveries || []
  }

  const setting = hiddenFacets && hiddenFacets['delivery-promise']

  if (!setting) {
    return deliveries
  }

  if (setting.hideAll) {
    return []
  }

  const hiddenNames = (setting.hiddenGroups || [])
    .map(group => group && group.name)
    .filter(Boolean)

  if (hiddenNames.length === 0) {
    return deliveries
  }

  return deliveries.filter(group => !hiddenNames.includes(group.name))
}

const formatDeliveryGroup = (group, intl, availableShippingValues) => {
  const titled = {
    ...group,
    title: getDeliveryGroupTitle(group.name),
    hideHeader: shouldHideDeliveryGroupHeader(group.name),
  }

  if (group.name !== SHIPPING_KEY) {
    return titled
  }

  const shippingValues =
    availableShippingValues.length !== 0
      ? availableShippingValues
      : defaultShippingValues

  return {
    ...titled,
    facets: group.facets
      .filter(facet => shippingValues.includes(facet.name))
      .map(facet => ({
        ...facet,
        name: intl.formatMessage({ id: shippingOptions[facet.name] }),
      })),
  }
}

const getDeliveriesFormatted = (
  deliveries,
  { availableShippingValues, showShippingFacet, hiddenFacets }
) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const intl = useIntl()

  const allowedDeliveries = filterHiddenDeliveryGroups(deliveries, hiddenFacets)

  const visibleDeliveries = showShippingFacet
    ? allowedDeliveries
    : allowedDeliveries.filter(d => d.name !== SHIPPING_KEY)

  return visibleDeliveries.map(group =>
    formatDeliveryGroup(group, intl, availableShippingValues)
  )
}

const getFilters = ({
  specificationFilters = [],
  priceRanges = [],
  brands = [],
  deliveries = [],
  brandsQuantity = 0,
  hiddenFacets = {},
  showShippingMethodFacet = false,
  availableShippingValues = [],
}) => {
  const deliveriesFormatted = getDeliveriesFormatted(deliveries, {
    availableShippingValues,
    showShippingFacet: showShippingMethodFacet,
    hiddenFacets,
  })

  const hiddenFacetsNames = (
    path(['specificationFilters', 'hiddenFilters'], hiddenFacets) || []
  ).map(filter => filter.name)

  const mappedSpecificationFilters = !path(
    ['specificationFilters', 'hideAll'],
    hiddenFacets
  )
    ? specificationFilters
        .filter(spec => !contains(spec.name, hiddenFacetsNames) && !spec.hidden)
        .map(spec => ({
          type: SPECIFICATION_FILTERS_TYPE,
          title: spec.name,
          facets: spec.facets,
          quantity: spec.quantity,
          key: spec.facets?.[0].key,
        }))
    : []

  const filters = [
    ...deliveriesFormatted,
    ...mappedSpecificationFilters,
    !hiddenFacets.brands &&
      !isEmpty(brands) && {
        type: BRANDS_TYPE,
        title: BRANDS_TITLE,
        facets: brands,
        quantity: brandsQuantity,
      },
    !hiddenFacets.priceRange &&
      !isEmpty(priceRanges) && {
        type: PRICE_RANGES_TYPE,
        title: PRICE_RANGES_TITLE,
        facets: priceRanges,
      },
  ].filter(Boolean)

  // The dynamic-estimate group must be the first filter to show up over all others.
  const estimateIndex = filters.findIndex(
    filter => filter.name === DYNAMIC_ESTIMATE_KEY
  )

  if (estimateIndex > 0) {
    const [estimate] = filters.splice(estimateIndex, 1)

    filters.unshift(estimate)
  }

  return filters
}

export default getFilters
