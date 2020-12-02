import {
  MAP_CATEGORY_CHAR,
  PATH_SEPARATOR,
  MAP_VALUES_SEP,
  PRODUCT_CLUSTER_IDS,
  FULLTEXT_QUERY_KEY,
} from '../constants'

const CATEGORY_DEPARTMENTS_CLUSTER_ID_FT = [
  MAP_CATEGORY_CHAR,
  PRODUCT_CLUSTER_IDS,
  FULLTEXT_QUERY_KEY,
]

const CATEGORY_DEPARTMENTS_FT = [MAP_CATEGORY_CHAR, FULLTEXT_QUERY_KEY]

/* With the addition of the new VTEX search, it is possible to have different maps.
  This function checks the equivalent possibilities for the 'c' map */
export const isSameMap = (map1: string, map2: string) => {
  if (CATEGORY_DEPARTMENTS_FT.includes(map1)) {
    return CATEGORY_DEPARTMENTS_FT.includes(map2)
  }
  return map1 === map2
}

export const isCategoryDepartmentCollectionOrFT = (term: string) => {
  return CATEGORY_DEPARTMENTS_CLUSTER_ID_FT.includes(term)
}

export const filterCategoryDepartmentCollectionAndFT = (context: any) => {
  const query = context.query.split(PATH_SEPARATOR)
  const map = context.map.split(MAP_VALUES_SEP)
  const newQuery = []
  const newMap = []
  for (let i = 0; i < map.length; i++) {
    if (isCategoryDepartmentCollectionOrFT(map[i])) {
      newQuery.push(query[i])
      newMap.push(map[i])
    }
  }
  return {
    query: newQuery.join(PATH_SEPARATOR),
    map: newMap.join(MAP_VALUES_SEP),
  }
}
