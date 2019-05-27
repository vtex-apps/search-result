import { flatten, path, contains, isEmpty } from 'ramda'

const getCategories = (tree = []) => {
  return [
    ...tree,
    ...flatten(tree.map(node => node.children && getCategories(node.children))),
  ].filter(Boolean)
}

const CATEGORIES_TITLE = 'store/search.filter.title.categories'
const BRANDS_TITLE = 'store/search.filter.title.brands'
const PRICE_RANGES_TITLE = 'store/search.filter.title.price-ranges'

const CATEGORIES_TYPE = 'Categories'
const BRANDS_TYPE = 'Brands'
const PRICE_RANGES_TYPE = 'PriceRanges'
const SPECIFICATION_FILTERS_TYPE = 'SpecificationFilters'

const getFilters = ({
  tree = [],
  specificationFilters = [],
  priceRanges = [],
  brands = [],
  hiddenFacets = {},
}) => {
  const categories = getCategories(tree)

  const hiddenFacetsNames = (
    path(['specificationFilters', 'hiddenFilters'], hiddenFacets) || []
  ).map(filter => filter.name)

  const mappedSpecificationFilters = !path(
    ['specificationFilters', 'hideAll'],
    hiddenFacets
  )
    ? specificationFilters
        .filter(spec => !contains(spec.name, hiddenFacetsNames))
        .map(spec => ({
          type: SPECIFICATION_FILTERS_TYPE,
          title: spec.name,
          facets: spec.facets,
        }))
    : []

    return [
    !hiddenFacets.categories && !isEmpty(categories) && {
      type: CATEGORIES_TYPE,
      title: CATEGORIES_TITLE,
      facets: categories,
    },
    ...mappedSpecificationFilters,
    !hiddenFacets.brands && !isEmpty(brands) && {
      type: BRANDS_TYPE,
      title: BRANDS_TITLE,
      facets: brands,
    },
    !hiddenFacets.priceRange && !isEmpty(priceRanges) && {
      type: PRICE_RANGES_TYPE,
      title: PRICE_RANGES_TITLE,
      facets: priceRanges,
    },
  ].filter(Boolean)
}

export default getFilters