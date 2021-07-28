import type { DESC } from '../constants'
import { SPEC_FILTERS, ASC } from '../constants'

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

export const sortFilterValues = (
  filters: Filters[],
  sortingRules: SortRules[]
): Filters[] => {
  if (!Array.isArray(sortingRules)) return filters
  const mappedRules = sortingRules.reduce<
    Record<SortRules['key'], Omit<SortRules, 'key'>>
  >((map, rule) => {
    map[rule.key.toLowerCase()] = {
      orderBy: rule.orderBy,
      order: rule.order ?? ASC,
    }

    return map
  }, {})

  const filtersAdjusted = filters.map((filter) => {
    const isSpecFilter = filter.type === SPEC_FILTERS

    if (!isSpecFilter) return filter

    const hasSortingRule = !!mappedRules[filter.key.toLowerCase()]

    if (!hasSortingRule) return filter

    const { orderBy, order } = mappedRules[filter.key.toLowerCase()]

    const filterCopy = { ...filter }

    filterCopy.facets.sort((a, b) => compare(a[orderBy], b[orderBy], order))

    return filterCopy
  })

  return filtersAdjusted
}
