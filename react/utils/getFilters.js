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

const facetDefault = {
  id: null,
  quantity: 0,
  name: null,
  key: SHIPPING_KEY,
  selected: false,
  value: null,
  link: null,
  linkEncoded: null,
  href: null,
  range: null,
  children: null,
  map: SHIPPING_KEY
}
const shippingFacetDefault = {
  name: SHIPPING_KEY,
  type: 'DELIVERY',
  hidden: false,
  quantity: 0,
  facets: [
    {
      ...facetDefault,
      name: 'delivery',
      value: 'delivery'
    },
    {
      ...facetDefault,
      name: 'pickup-in-point',
      value: 'pickup-in-point'
    },
    {
      ...facetDefault,
      name: 'pickup-nearby',
      value: 'pickup-nearby'
    },
    {
      ...facetDefault,
      name: 'pickup-all',
      value: 'pickup-all'
    }
  ]
}

const getFilters = ({
  specificationFilters = [],
  priceRanges = [],
  brands = [],
  deliveries = [],
  brandsQuantity = 0,
  hiddenFacets = {},
  showShippingFacet = false
}) => {
  const intl = useIntl()

  const shipping = deliveries.map((delivery) => ({
    ...delivery,
    title: SHIPPING_TITLE,
    facets: delivery.facets.map((facet) => ({
      ...facet,
      name: intl.formatMessage({ id: SHIPPING_OPTIONS[facet.name] }) ,
    }))
  }))

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
  
  const deliveriesFormatted = getFormattedDeliveries(shipping, showShippingFacet)

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
  if(!showShippingFacet){
    return deliveries.filter((d) => d.name !== SHIPPING_KEY)
  }

  const shippingFacet = deliveries.find((d) => d.name === SHIPPING_KEY )
  if(!shippingFacet) {
    return [
      ...deliveries,
      shippingFacetDefault
    ]
  }

  const facetsNotIncluded = shippingFacetDefault.facets.filter((facet) => 
    shippingFacet.facets.every((f) => f.value !== facet.value)
  )

  shippingFacet.facets = [
    ...shippingFacet.facets,
    ...facetsNotIncluded
  ]

  return deliveries.map((facet) => facet.name === SHIPPING_KEY ? shippingFacet : facet)
}

export default getFilters
