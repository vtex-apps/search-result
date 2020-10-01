import { path, contains, isEmpty } from 'ramda'

export const CATEGORIES_TITLE = 'store/search.filter.title.categories'
export const BRANDS_TITLE = 'store/search.filter.title.brands'
export const PRICE_RANGES_TITLE = 'store/search.filter.title.price-ranges'

const BRANDS_TYPE = 'Brands'
const PRICE_RANGES_TYPE = 'PriceRanges'
const SPECIFICATION_FILTERS_TYPE = 'SpecificationFilters'

const getFilters = ({
  specificationFilters = [],
  priceRanges = [],
  brands = [],
  brandsQuantity = 0,
  hiddenFacets = {},
}) => {
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
        }))
    : []

  return [
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
