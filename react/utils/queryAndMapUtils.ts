import {
  MAP_CATEGORY_CHAR,
  DEPARTMENT,
  CATEGORY,
  PATH_SEPARATOR,
  MAP_VALUES_SEP,
  PRODUCT_CLUSTER_IDS,
} from '../constants'

const CATEGORY_DEPARTMENTS_CLUSTER_ID = [
  MAP_CATEGORY_CHAR,
  PRODUCT_CLUSTER_IDS,
  CATEGORY,
  DEPARTMENT,
]

const CATEGORY_DEPARTMENTS = [MAP_CATEGORY_CHAR, CATEGORY, DEPARTMENT]

/* With the addition of the new VTEX search, it is possible to have different maps.
  This function checks the equivalent possibilities for the 'c' map */
export const isSameMap = (map1: string, map2: string) => {
  if (CATEGORY_DEPARTMENTS.includes(map1)) {
    return CATEGORY_DEPARTMENTS.includes(map2)
  }
  return map1 === map2
}

export const isCategoryDepartmentOrCollection = (term: string) => {
  return CATEGORY_DEPARTMENTS_CLUSTER_ID.includes(term)
}

export const filterCategoryDepartmentAndCollection = context => {
  const query = context.query.split(PATH_SEPARATOR)
  const map = context.map.split(MAP_VALUES_SEP)
  const newQuery = []
  const newMap = []
  for (let i = 0; i < map.length; i++) {
    if (isCategoryDepartmentOrCollection(map[i])) {
      newQuery.push(query[i])
      newMap.push(map[i])
    }
  }
  return {
    query: newQuery.join(PATH_SEPARATOR),
    map: newMap.join(MAP_VALUES_SEP),
  }
}
