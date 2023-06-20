import { zipObj } from 'ramda'

interface SpecificationFilter {
  facets?: any[]
  hidden: boolean
  name: string
  quantity: number
  type: string
}

interface CategoriesTrees {
  id: string
  name: string
  selected: boolean
  children?: CategoriesTrees[]
}

interface QueryArgs {
  query: string
  map: string
}

interface Facets {
  categoriesTrees?: CategoriesTrees[]
  queryArgs?: QueryArgs
  specificationFilters?: SpecificationFilter[]
}

interface Breadcrumb {
  name: string
  href: string
}

interface SearchQueryData {
  searchMetadata?: {
    titleTag: string
    metaTagDescription: string
  }
  productSearch?: {
    breadcrumb: Breadcrumb[]
    recordsFiltered: number
    operator?: string
    searchState?: string
    correction?: {
      misspelled: boolean
    }
  }
  facets?: Facets
}

export interface SearchQuery {
  loading: boolean
  products: any
  data?: SearchQueryData
  variables: {
    query: string
    map: string
  }
}

interface GetTitleTagParams {
  titleTag: string
  storeTitle: string
  term?: string
  pageTitle?: string
  pageNumber?: number
  removeStoreNameTitle?: boolean
}

const getDecodeURIComponent = (encodedURIComponent: string) => {
  try {
    return decodeURIComponent(encodedURIComponent)
  } catch {
    return encodedURIComponent
  }
}

const capitalize = (str?: string) => {
  return str && str.charAt(0).toUpperCase() + str.slice(1)
}

export const getTitleTag = ({
  titleTag,
  storeTitle,
  term,
  pageTitle,
  pageNumber = 0,
  removeStoreNameTitle,
}: GetTitleTagParams) => {
  /*
  titleNumber and storeTitleFormatted depend on the value of enablePageNumberTitle and removeStoreNameTitle params,
  by default, the value of enablePageNumberTitle and removeStoreNameTitle is false, only if the value of these
  parameters is true, it will affect the value of titleNumber or storeTitleFormatted
  */
  const titleNumber = pageNumber > 0 ? ` #${pageNumber}` : ''
  const storeTitleFormatted = removeStoreNameTitle ? '' : ` - ${storeTitle}`

  if (titleTag) {
    return `${getDecodeURIComponent(
      titleTag
    )}${titleNumber}${storeTitleFormatted}`
  }

  if (pageTitle) {
    return `${getDecodeURIComponent(
      pageTitle
    )}${titleNumber}${storeTitleFormatted}`
  }

  if (term) {
    return `${capitalize(
      getDecodeURIComponent(term)
    )}${titleNumber}${storeTitleFormatted}`
  }

  return storeTitle
}

const getDepartmentFromSpecificationFilters = (facets?: Facets) => {
  if (!facets?.queryArgs?.map.split(',').includes('c')) {
    return
  }

  const departmentFilter = facets.specificationFilters?.find(specFilter => {
    return specFilter.facets?.[0].key === 'category-1'
  })

  return departmentFilter?.facets?.find(facet => facet.selected)
}

const getDepartment = (searchQuery: SearchQueryData) => {
  if (searchQuery.facets?.categoriesTrees?.length) {
    return searchQuery.facets.categoriesTrees.find(
      department => department.selected
    )
  }

  return getDepartmentFromSpecificationFilters(searchQuery.facets)
}

export const getDepartmentMetadata = (searchQuery?: SearchQueryData) => {
  if (
    !searchQuery ||
    !searchQuery.facets ||
    !searchQuery.facets.categoriesTrees
  ) {
    return
  }

  const department = getDepartment(searchQuery)

  if (!department) {
    return
  }

  return {
    id: department.id,
    name: department.name,
  }
}

const getCategoryFromSpecificationFilters = (facets?: Facets) => {
  const totalCategories =
    facets?.queryArgs?.map.split(',').filter((key: string) => key === 'c')
      .length ?? 0

  if (totalCategories <= 1) {
    return
  }

  const categoryFilter = facets?.specificationFilters?.find(specFilter => {
    return specFilter.facets?.[0].key === 'category-2'
  })

  return categoryFilter?.facets?.find(facet => facet.selected)
}

const getLastCategory = (
  category: CategoriesTrees,
  facets?: Facets
): CategoriesTrees => {
  const selectedCategory =
    category.children &&
    category.children.length > 0 &&
    category.children.find(currCategory => currCategory.selected)

  if (!selectedCategory) {
    return getCategoryFromSpecificationFilters(facets) ?? category
  }

  return getLastCategory(selectedCategory)
}

export const getCategoryMetadata = (searchQuery?: SearchQueryData) => {
  if (
    !searchQuery ||
    !searchQuery.facets ||
    !searchQuery.facets.categoriesTrees
  ) {
    return
  }

  const department = getDepartment(searchQuery)

  if (!department) {
    return
  }

  const category = getLastCategory(department, searchQuery.facets)

  if (category === department) {
    return
  }

  return {
    id: category.id,
    name: category.name,
  }
}

export const getSearchMetadata = (searchQuery?: SearchQueryData) => {
  if (
    !searchQuery ||
    !searchQuery.productSearch ||
    !searchQuery.facets ||
    !searchQuery.facets.queryArgs
  ) {
    return
  }

  const { query, map } = searchQuery.facets.queryArgs
  const queryMap = zipObj(map.split(','), query.split('/'))

  const searchTerm = queryMap.ft

  let decodedTerm = ''

  // This try/catch works to prevent decoding search terms that end in "%".
  try {
    decodedTerm = decodeURIComponent(searchTerm || '')
  } catch (e) {
    decodedTerm = decodeURIComponent(encodeURIComponent(searchTerm || ''))
  }

  const department = getDepartment(searchQuery)

  return {
    term: decodedTerm || undefined,
    category: department ? { id: department.id, name: department.name } : null,
    results: searchQuery.productSearch.recordsFiltered,
    operator: searchQuery.productSearch.operator,
    searchState: searchQuery.productSearch.searchState,
    correction: searchQuery.productSearch.correction,
  }
}
