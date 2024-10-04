import { path, contains, isEmpty } from 'ramda'
import { useIntl } from 'react-intl'

export const SHIPPING_TITLE = 'store/search.filter.title.shipping'
export const CATEGORIES_TITLE = 'store/search.filter.title.categories'
export const BRANDS_TITLE = 'store/search.filter.title.brands'
export const PRICE_RANGES_TITLE = 'store/search.filter.title.price-ranges'

export const SHIPPING_OPTIONS = {
  delivery: 'store/search.filter.shipping.name.delivery',
  'pickup-in-point': 'store/search.filter.shipping.name.pickup-in-point',
  'pickup-nearby': 'store/search.filter.shipping.name.pickup-nearby',
  'pickup-all': 'store/search.filter.shipping.name.pickup-all',
}

const BRANDS_TYPE = 'Brands'
const PRICE_RANGES_TYPE = 'PriceRanges'
const SPECIFICATION_FILTERS_TYPE = 'SpecificationFilters'
const SHIPPING_KEY = 'shipping'

const shippingFacetDefault = {
  name: SHIPPING_KEY,
  type: 'DELIVERY',
  hidden: false,
  quantity: 0,
  facets: Object.keys(SHIPPING_OPTIONS).map(option => ({
    id: null,
    quantity: 0,
    name: option,
    key: SHIPPING_KEY,
    selected: false,
    map: SHIPPING_KEY,
    value: option,
  })),
}

const getFilters = ({
  specificationFilters = [],
  priceRanges = [],
  brands = [],
  deliveries = [],
  brandsQuantity = 0,
  hiddenFacets = {},
  showShippingFacet = false,
}) => {
  const intl = useIntl()

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

  const deliveriesFormatted = getFormattedDeliveries(
    deliveries,
    showShippingFacet
  )

  const shippingIndex = deliveriesFormatted.findIndex(
    d => d.name === SHIPPING_KEY
  )

  if (shippingIndex !== -1) {
    deliveriesFormatted[shippingIndex] = {
      ...deliveriesFormatted[shippingIndex],
      title: SHIPPING_TITLE,
      facets: deliveriesFormatted[shippingIndex].facets.map(facet => ({
        ...facet,
        name: intl.formatMessage({ id: SHIPPING_OPTIONS[facet.name] }),
      })),
    }
  }

  return [
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
}

const getFormattedDeliveries = (deliveries, showShippingFacet) => {
  if (!showShippingFacet) {
    return deliveries.filter(d => d.name !== SHIPPING_KEY)
  }

  const shippingFacet = deliveries.find(d => d.name === SHIPPING_KEY)

  if (!shippingFacet) {
    return [...deliveries, shippingFacetDefault]
  }

  const facetsNotIncluded = shippingFacetDefault.facets.filter(facet =>
    shippingFacet.facets.every(f => f.value !== facet.value)
  )

  shippingFacet.facets = [...shippingFacet.facets, ...facetsNotIncluded]

  return deliveries.map(facet =>
    facet.name === SHIPPING_KEY ? shippingFacet : facet
  )
}

export default getFilters
