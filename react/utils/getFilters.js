import { path, contains, isEmpty } from 'ramda'
import { useIntl } from 'react-intl'

export const SHIPPING_TITLE = 'store/search.filter.title.shipping'
export const CATEGORIES_TITLE = 'store/search.filter.title.categories'
export const BRANDS_TITLE = 'store/search.filter.title.brands'
export const PRICE_RANGES_TITLE = 'store/search.filter.title.price-ranges'

export const shippingOptions = {
  delivery: 'store/search.filter.shipping.name.delivery',
  'pickup-in-point': 'store/search.filter.shipping.name.pickup-in-point',
  'pickup-nearby': 'store/search.filter.shipping.name.pickup-nearby',
  'pickup-all': 'store/search.filter.shipping.name.pickup-all',
}

export const SHIPPING_KEY = 'shipping'

const BRANDS_TYPE = 'Brands'
const PRICE_RANGES_TYPE = 'PriceRanges'
const SPECIFICATION_FILTERS_TYPE = 'SpecificationFilters'

const getFilters = ({
  specificationFilters = [],
  priceRanges = [],
  brands = [],
  deliveries = [],
  brandsQuantity = 0,
  hiddenFacets = {},
  showShippingFacet = false,
  availableShippingValues = [],
}) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const intl = useIntl()

  let deliveriesFormatted = deliveries

  let shipping = deliveries.find(d => d.name === SHIPPING_KEY)

  if (shipping && availableShippingValues.length !== 0) {
    shipping = {
      ...shipping,
      facets: shipping.facets.filter(facet =>
        availableShippingValues.includes(facet.name)
      ),
    }
  }

  if (shipping) {
    const shippingFormattedFacetsName = {
      ...shipping,
      title: SHIPPING_TITLE,
      facets: shipping.facets.map(facet => ({
        ...facet,
        name: intl.formatMessage({ id: shippingOptions[facet.name] }),
      })),
    }

    deliveriesFormatted = deliveries.map(facet =>
      facet.name === SHIPPING_KEY ? shippingFormattedFacetsName : facet
    )
  }

  if (!showShippingFacet) {
    deliveriesFormatted = deliveriesFormatted.filter(
      d => d.name !== SHIPPING_KEY
    )
  }

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

export default getFilters
