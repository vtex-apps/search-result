import { SPEC_FILTERS, ASC, DESC } from '../constants'

interface Filters {
  key: string
  quantity: number
  title: string
  type: string
  facets: Facets[]
}

interface Facets {
  name: string
  quantity: number
}

interface SortRules {
  key: string
  orderBy: keyof Facets
  order: typeof ASC | typeof DESC
}

const compare = (
  a: string | number,
  b: string | number,
  order: SortRules['order']
) => {
  const hasSameType = typeof a === typeof b
  const isASC = order.toUpperCase() === ASC

  if (!hasSameType) return 0

  const isString = typeof a === 'string'

  if (isString) {
    if (isASC) return (a as string).localeCompare(b as string)

    return (b as string).localeCompare(a as string)
  }

  if (isASC) return (a as number) - (b as number)

  return (b as number) - (a as number)
}

const validateRule = (rule: unknown): boolean => {
  if (typeof rule !== 'object' || rule === null) return false

  const ruleKeys = Object.keys(rule)

  return ruleKeys.indexOf('key') > -1 && ruleKeys.indexOf('orderBy') > -1
}

const ensureOrderValue = (order: string): SortRules['order'] => {
  const isDESC = order.toUpperCase() === DESC

  if (isDESC) return DESC

  return ASC
}

export const sortFilterValues = (
  filters: Filters[],
  sortingRules: SortRules[]
): Filters[] => {
  if (!Array.isArray(sortingRules)) {
    console.warn(
      'Wrong type passed as facetOrdering prop to filter-navigator.v3 block. It should be an array.'
    )

    return filters
  }

  const mappedRules = sortingRules.reduce<
    Record<SortRules['key'], Omit<SortRules, 'key'>>
  >((map, rule) => {
    if (!validateRule(rule)) {
      console.warn(
        'One of the rules passed inside facetOrdering prop to filter-navigator.v3 block has the wrong signature and was ignored.'
      )

      return map
    }

    map[rule.key.toLowerCase()] = {
      orderBy: rule.orderBy,
      order: ensureOrderValue(rule.order ?? ASC),
    }

    return map
  }, {})

  const filtersAdjusted = filters.map((filter) => {
    const isSpecFilter = filter.type === SPEC_FILTERS
    const hasSortingRule = filter.key
      ? !!mappedRules[filter.key.toLowerCase()]
      : false

    if (!isSpecFilter || !hasSortingRule) return filter

    const { orderBy, order } = mappedRules[filter.key.toLowerCase()]

    const filterCopy = { ...filter }

    filterCopy.facets.sort((a, b) => compare(a[orderBy], b[orderBy], order))

    return filterCopy
  })

  return filtersAdjusted
}
