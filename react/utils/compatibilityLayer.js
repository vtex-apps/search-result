// eslint-disable-next-line no-restricted-imports
import { groupBy, pathOr, zipObj } from 'ramda'

import { PATH_SEPARATOR, MAP_VALUES_SEP } from '../constants'
import { shippingOptions, SHIPPING_KEY } from './getFilters'

const shippingFacetDefault = {
  name: SHIPPING_KEY,
  type: 'DELIVERY',
  hidden: false,
  quantity: 0,
  facets: Object.keys(shippingOptions).map(option => ({
    id: null,
    quantity: 0,
    name: option,
    key: SHIPPING_KEY,
    selected: false,
    map: SHIPPING_KEY,
    value: option,
  })),
}

export const getMainSearches = (query, map) => {
  const querySegments = (query && query.split(PATH_SEPARATOR)) || []
  const mapSegments = (map && map.split(MAP_VALUES_SEP)) || []
  const zip = zipObj(mapSegments, querySegments)

  return {
    ft: zip.ft,
    productClusterIds: zip.productClusterIds,
    seller: zip.seller,
  }
}

export const buildSelectedFacetsAndFullText = (query, map, priceRange) => {
  if (!map || !query) {
    return []
  }

  const queryValues = query.split('/')
  const mapValues = decodeURIComponent(map).split(',')

  let fullText

  const selectedFacets =
    queryValues.length >= mapValues.length
      ? mapValues.map((mapValue, i) => {
          if (mapValue === 'ft') {
            try {
              fullText = decodeURI(queryValues[i])
            } catch {
              fullText = queryValues[i]
            }
          }

          return {
            key: mapValues[i],
            value: queryValues[i],
          }
        })
      : []

  if (priceRange) {
    selectedFacets.push({
      key: 'priceRange',
      value: priceRange,
    })
  }

  return [selectedFacets, fullText]
}

const addMap = facet => {
  facet.map = facet.key

  if (facet.children) {
    facet.children.forEach(facetChild => addMap(facetChild))
  }
}

export const detachFiltersByType = (
  facets,
  deliveryPromisesEnabled = false
) => {
  facets.forEach(facet => facet.facets.forEach(value => addMap(value)))

  const byType = groupBy(filter => filter.type)
  const groupedFilters = byType(facets)
  const brands = pathOr([], ['BRAND', 0, 'facets'], groupedFilters)
  const brandsQuantity =
    groupedFilters &&
    groupedFilters.BRAND &&
    groupedFilters.BRAND[0] &&
    groupedFilters.BRAND[0].quantity != null
      ? groupedFilters.BRAND[0].quantity
      : 0

  const specificationFilters = (groupedFilters.NUMBER || []).concat(
    groupedFilters.TEXT || []
  )

  const deliveries = deliveryPromisesEnabled
    ? getFormattedDeliveries(groupedFilters.DELIVERY || [])
    : []

  const categoriesTrees = pathOr(
    [],
    ['CATEGORYTREE', 0, 'facets'],
    groupedFilters
  )

  const priceRanges = pathOr(
    [],
    ['PRICERANGE', 0, 'facets'],
    groupedFilters
  ).map(priceRange => {
    return {
      ...priceRange,
      slug: `de-${priceRange.range.from}-a-${priceRange.range.to}`,
    }
  })

  return {
    brands,
    brandsQuantity,
    specificationFilters,
    categoriesTrees,
    priceRanges,
    deliveries,
  }
}

export const buildQueryArgsFromSelectedFacets = selectedFacets => {
  return selectedFacets.reduce(
    (queryArgs, facet, index) => {
      queryArgs.query += `${index > 0 ? '/' : ''}${facet.value}`
      queryArgs.map += `${index > 0 ? ',' : ''}${facet.key}`

      return queryArgs
    },
    { query: '', map: '' }
  )
}

const getFormattedDeliveries = deliveries => {
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
